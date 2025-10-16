import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { 
  issueCredential, 
  requestAccess, 
  getSignerInfo,
  verifyCredential 
} from '../lib/api';
import { createContractInstance, CONTRACT_ABIS, CONTRACT_ADDRESSES } from '../lib/contracts';

interface User {
  walletAddress: string;
  email: string;
  name: string;
  phone?: string;
}

interface Credential {
  tokenId: string;
  to: string;
  credentialHash: string;
  uri: string;
  txHash: string;
  issuedAt: string;
}

interface AccessRequest {
  requestId: string;
  requester: string;
  subject: string;
  purposeHash: string;
  approved: boolean;
  signature?: string;
  createdAt: string;
}

export function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'credentials' | 'consents' | 'requests'>('credentials');

  // Form states
  const [credentialForm, setCredentialForm] = useState({
    to: '',
    metadataURI: '',
    payload: ''
  });
  const [accessForm, setAccessForm] = useState({
    requester: '',
    subject: '',
    purpose: ''
  });
  const [approveForm, setApproveForm] = useState({
    requestId: '',
    signature: '',
    proof: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user?.walletAddress) {
      loadCredentials();
      loadAccessRequests();
    }
  }, [user?.walletAddress]);

  const loadUserData = async () => {
    try {
      const eth = (window as any).ethereum;
      if (!eth) throw new Error('No wallet provider');
      
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // For now, we'll create a mock user. In real implementation, fetch from API
      setUser({
        walletAddress: address,
        email: 'user@example.com',
        name: 'User Name',
        phone: '+1234567890'
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError('Failed to load user data');
    }
  };

  const loadCredentials = async () => {
    if (!user?.walletAddress) return;
    try {
      const { getUserCredentials } = await import('../lib/api');
      const data = await getUserCredentials(user.walletAddress);
      if (data.success) {
        setCredentials(data.credentials);
      }
    } catch (error) {
      console.error('Failed to load credentials:', error);
    }
  };

  const loadAccessRequests = async () => {
    if (!user?.walletAddress) return;
    try {
      const { getUserAccessRequests } = await import('../lib/api');
      const data = await getUserAccessRequests(user.walletAddress);
      if (data.success) {
        setAccessRequests(data.requests);
      }
    } catch (error) {
      console.error('Failed to load access requests:', error);
    }
  };

  const handleIssueCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = JSON.parse(credentialForm.payload);
      const result = await issueCredential(
        credentialForm.to,
        credentialForm.metadataURI,
        payload
      );
      
      setSuccess(`Credential issued successfully! Token ID: ${result.transaction?.tokenId}`);
      setCredentialForm({ to: '', metadataURI: '', payload: '' });
    } catch (error: any) {
      setError(error.message || 'Failed to issue credential');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const purpose = JSON.parse(accessForm.purpose);
      const result = await requestAccess(
        accessForm.requester,
        accessForm.subject,
        purpose
      );
      
      setSuccess(`Access request submitted! Request ID: ${result.requestId}`);
      setAccessForm({ requester: '', subject: '', purpose: '' });
    } catch (error: any) {
      setError(error.message || 'Failed to request access');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate requestId format
      if (!/^0x[0-9a-fA-F]{64}$/.test(approveForm.requestId.trim())) {
        setError('Invalid Request ID. Use the bytes32 value returned from Request Access (0x + 64 hex).');
        return;
      }

      // Resolve access control contract address
      let accessAddress = CONTRACT_ADDRESSES.ACCESS_CONTROL;
      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        try {
          const baseURL = (import.meta as any).env.VITE_BACKEND_URL || 'https://chainid.onrender.com';
          const { data } = await fetch(`${baseURL}/api/contracts/addresses`).then(r => r.json());
          accessAddress = data?.addresses?.accessControl || '';
        } catch (e) {
          // ignore, will be validated below
        }
      }

      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        setError('ACCESS_CONTROL address not set. Set VITE_ACCESS_CONTROL_CONTRACT_ADDRESS or ensure backend /api/contracts/addresses works.');
        return;
      }

      const eth = (window as any).ethereum;
      if (!eth) throw new Error('No wallet provider');
      
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const access = createContractInstance(accessAddress, CONTRACT_ABIS.ACCESS_CONTROL, signer);

      // Ensure the connected wallet IS the subject for this requestId
      try {
        const req = await (access as any).requestOf(approveForm.requestId);
        const subjectOnChain: string = req?.subject || req?.[1] || '';
        const connected = (await signer.getAddress());
        if (!subjectOnChain || connected.toLowerCase() !== subjectOnChain.toLowerCase()) {
          setError(`Please switch wallet to subject address ${subjectOnChain} to approve this request.`);
          return;
        }
      } catch (_e) {
        // If we cannot read, proceed; contract call will still enforce and revert if wrong
      }

      const tx = await (access as any).approve(
        approveForm.requestId as any, 
        approveForm.signature as any, 
        (approveForm.proof && approveForm.proof !== '') ? approveForm.proof : '0x'
      );
      const receipt = await tx.wait();
      
      setSuccess(`Access request approved successfully! Transaction: ${receipt.hash}`);
      setApproveForm({ requestId: '', signature: '', proof: '' });
    } catch (error: any) {
      console.error('Failed to approve access:', error);
      setError('Failed to approve access.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSignature = async () => {
    try {
      const eth = (window as any).ethereum;
      if (!eth) throw new Error('No wallet provider');
      
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      
      const message = ethers.getBytes(approveForm.requestId);
      const signature = await signer.signMessage(message);
      setApproveForm(prev => ({ ...prev, signature }));
    } catch (error: any) {
      setError('Failed to generate signature: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-700/40">
                <span className="text-white font-bold text-lg">Ξ</span>
              </div>
              <Link to="/" className="text-white text-2xl font-bold">IdentiChain</Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link to="/government" className="text-slate-300 hover:text-white transition-colors">
                Government
              </Link>
              <Link to="/telecommunication" className="text-slate-300 hover:text-white transition-colors">
                Telecommunication
              </Link>
              <Link to="/user-registration" className="text-slate-300 hover:text-white transition-colors">
                Registration
              </Link>
              <div className="text-slate-300">
                {user.name} ({user.email})
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-sm font-medium mb-6 border border-green-500/30">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              User Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Your <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">Digital Identity</span> Hub
            </h1>
            <p className="text-xl text-slate-300/80 max-w-3xl mx-auto">
              Manage your credentials, control access permissions, and maintain complete sovereignty over your digital identity.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-200">
            {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-slate-900/60 rounded-lg p-1 border border-slate-800/60">
              <button
                onClick={() => setActiveTab('credentials')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'credentials'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                My Credentials
              </button>
              <button
                onClick={() => setActiveTab('consents')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'consents'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                My Consents
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'requests'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                Access Requests
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'credentials' && (
          <div className="grid lg:grid-cols-2 gap-8">
          {/* Issue Credential */}
          <div className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-800/60">
            <h2 className="text-2xl font-bold mb-6 text-indigo-400">Issue Credential</h2>
            <form onSubmit={handleIssueCredential} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={credentialForm.to}
                  onChange={(e) => setCredentialForm(prev => ({ ...prev, to: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Metadata URI
                </label>
                <input
                  type="text"
                  value={credentialForm.metadataURI}
                  onChange={(e) => setCredentialForm(prev => ({ ...prev, metadataURI: e.target.value }))}
                  placeholder="ipfs://..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Payload (JSON)
                </label>
                <textarea
                  value={credentialForm.payload}
                  onChange={(e) => setCredentialForm(prev => ({ ...prev, payload: e.target.value }))}
                  placeholder='{"type":"KYC","level":"basic"}'
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Issuing...' : 'Issue Credential'}
              </button>
            </form>
          </div>

          {/* Request Access */}
          <div className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-800/60">
            <h2 className="text-2xl font-bold mb-6 text-orange-400">Request Access</h2>
            <form onSubmit={handleRequestAccess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Requester Address
                </label>
                <input
                  type="text"
                  value={accessForm.requester}
                  onChange={(e) => setAccessForm(prev => ({ ...prev, requester: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subject Address
                </label>
                <input
                  type="text"
                  value={accessForm.subject}
                  onChange={(e) => setAccessForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Purpose (JSON)
                </label>
                <textarea
                  value={accessForm.purpose}
                  onChange={(e) => setAccessForm(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder='{"reason":"KYC verification","fields":["name","email"]}'
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Requesting...' : 'Request Access'}
              </button>
            </form>
          </div>

          {/* Approve Access */}
          <div className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-800/60">
            <h2 className="text-2xl font-bold mb-6 text-green-400">Approve Access</h2>
            <form onSubmit={handleApproveAccess} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Request ID
                </label>
                <input
                  type="text"
                  value={approveForm.requestId}
                  onChange={(e) => setApproveForm(prev => ({ ...prev, requestId: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Signature
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={approveForm.signature}
                    onChange={(e) => setApproveForm(prev => ({ ...prev, signature: e.target.value }))}
                    placeholder="0x..."
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSignature}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Sign
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Optional Proof
                </label>
                <input
                  type="text"
                  value={approveForm.proof}
                  onChange={(e) => setApproveForm(prev => ({ ...prev, proof: e.target.value }))}
                  placeholder="0x... (optional)"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Approving...' : 'Approve Access'}
              </button>
            </form>
          </div>

          {/* My Credentials */}
          <div className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-800/60">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">My Credentials</h2>
            {credentials.length === 0 ? (
              <p className="text-slate-400">No credentials found</p>
            ) : (
              <div className="space-y-4">
                {credentials.map((cred) => (
                  <div key={cred.tokenId} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Token ID: {cred.tokenId}</p>
                        <p className="text-sm text-slate-400">URI: {cred.uri}</p>
                        <p className="text-sm text-slate-400">Issued: {new Date(cred.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${cred.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View TX
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Consents Tab */}
        {activeTab === 'consents' && (
          <div className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-800/60">
            <h2 className="text-2xl font-bold mb-6 text-green-400">My Consents</h2>
            {accessRequests.filter(req => req.subject === user?.walletAddress).length === 0 ? (
              <p className="text-slate-400">No consents found</p>
            ) : (
              <div className="space-y-4">
                {accessRequests
                  .filter(req => req.subject === user?.walletAddress)
                  .map((consent) => (
                    <div key={consent.requestId} className="p-4 bg-slate-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              consent.approved 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                              {consent.approved ? 'Approved' : 'Pending'}
                            </span>
                            <span className="text-sm text-slate-400">
                              {new Date(consent.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300">
                            <strong>Requester:</strong> {consent.requester}
                          </p>
                          <p className="text-sm text-slate-300">
                            <strong>Purpose Hash:</strong> {consent.purposeHash}
                          </p>
                          <p className="text-sm text-slate-300">
                            <strong>Request ID:</strong> {consent.requestId}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!consent.approved && (
                            <button
                              onClick={() => {
                                setApproveForm(prev => ({ 
                                  ...prev, 
                                  requestId: consent.requestId 
                                }));
                                setActiveTab('requests');
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              // TODO: Implement revoke consent
                              setError('Revoke consent functionality coming soon');
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Access Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-8">
            {/* Approve Access */}
            <div className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-800/60">
              <h2 className="text-2xl font-bold mb-6 text-green-400">Approve Access</h2>
              <form onSubmit={handleApproveAccess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Request ID
                  </label>
                  <input
                    type="text"
                    value={approveForm.requestId}
                    onChange={(e) => setApproveForm(prev => ({ ...prev, requestId: e.target.value }))}
                    placeholder="0x..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Signature
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={approveForm.signature}
                      onChange={(e) => setApproveForm(prev => ({ ...prev, signature: e.target.value }))}
                      placeholder="0x..."
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateSignature}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Sign
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Optional Proof
                  </label>
                  <input
                    type="text"
                    value={approveForm.proof}
                    onChange={(e) => setApproveForm(prev => ({ ...prev, proof: e.target.value }))}
                    placeholder="0x... (optional)"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Approving...' : 'Approve Access'}
                </button>
              </form>
            </div>

            {/* Pending Requests */}
            <div className="bg-slate-900/60 p-6 rounded-xl shadow-lg border border-slate-800/60">
              <h2 className="text-2xl font-bold mb-6 text-orange-400">Pending Requests</h2>
              {accessRequests.filter(req => req.requester === user?.walletAddress).length === 0 ? (
                <p className="text-slate-400">No pending requests found</p>
              ) : (
                <div className="space-y-4">
                  {accessRequests
                    .filter(req => req.requester === user?.walletAddress)
                    .map((request) => (
                      <div key={request.requestId} className="p-4 bg-slate-800 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                request.approved 
                                  ? 'bg-green-900 text-green-300' 
                                  : 'bg-yellow-900 text-yellow-300'
                              }`}>
                                {request.approved ? 'Approved' : 'Pending'}
                              </span>
                              <span className="text-sm text-slate-400">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">
                              <strong>Subject:</strong> {request.subject}
                            </p>
                            <p className="text-sm text-slate-300">
                              <strong>Purpose Hash:</strong> {request.purposeHash}
                            </p>
                            <p className="text-sm text-slate-300">
                              <strong>Request ID:</strong> {request.requestId}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
