import React, { useState, useRef } from 'react';
import { motion } from "motion/react";
import { Link } from 'react-router-dom';
import { connectWallet } from '../lib/wallet';
import { register, verifyCredential, verifyProfileHash, issueCredential, getSignerInfo, addIssuer, requestAccess } from '../lib/api';
import { ethers } from 'ethers';
import { CONTRACT_ABIS, CONTRACT_ADDRESSES, createContractInstance } from '../lib/contracts';
import axios from 'axios';
import QRCode from 'qrcode';
import { QRScanner } from '../components/QRScanner';

// Icon components
const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const PersonIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ChartIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const BuildingIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);

const WalletIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
  </svg>
);

const DocumentIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

export const Government: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'verify' | 'dashboard'>('create');

  // Create Identity State (from Register.tsx)
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState('');
  const [nid, setNid] = useState('');
  const [createResult, setCreateResult] = useState<any>(null);
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  // Verify Identity State (from Verify.tsx)
  const [tokenId, setTokenId] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  // Dashboard State (from Dashboard.tsx)
  const [to, setTo] = useState('');
  const [uri, setUri] = useState('ipfs://example');
  const [payload, setPayload] = useState('{"type":"KYC","level":"basic"}');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [credentialType, setCredentialType] = useState('Government Credential');
  const [dashboardResult, setDashboardResult] = useState<any>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [backendSigner, setBackendSigner] = useState<{ address?: string, balance?: string } | null>(null);
  const [isGranting, setIsGranting] = useState(false);
  const [issuerGranted, setIssuerGranted] = useState(false);
  const [issueSuccess, setIssueSuccess] = useState<{ hash?: string } | null>(null);

  // Access control state
  const [subject, setSubject] = useState('');
  const [purpose, setPurpose] = useState('{"reason":"KYC verification"}');
  const [requestOut, setRequestOut] = useState<any>(null);
  const [reqId, setReqId] = useState('');
  const [signature, setSignature] = useState('');
  const [proof, setProof] = useState('');
  const [approveOut, setApproveOut] = useState<any>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isFetchingReq, setIsFetchingReq] = useState(false);
  const [requestDetails, setRequestDetails] = useState<any>(null);

  // QR Code State
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [scannedData, setScannedData] = useState<string>('');
  const [showScanner, setShowScanner] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidHexHash = (value: string) => /^0x[0-9a-fA-F]{64}$/.test(value.trim());

  // Create Identity Functions
  async function onConnect() {
    setIsCreateLoading(true);
    try {
      const r = await connectWallet();
      if (r) setAddress(r.address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsCreateLoading(false);
    }
  }

  async function onCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setIsCreateLoading(true);
    try {
      const profile = { name, nid };
      const data = await register(address, profile);
      setCreateResult(data);

      // Generate QR code for profileHash if registration is successful
      if (data?.profileHash) {
        try {
          const qrDataUrl = await QRCode.toDataURL(data.profileHash);
          setQrCodeDataUrl(qrDataUrl);
        } catch (qrError) {
          console.error('Failed to generate QR code:', qrError);
        }
      }
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      setCreateResult({ error: errorMessage || 'Registration failed' });
      console.error('Registration failed:', error);
    } finally {
      setIsCreateLoading(false);
    }
  }

  // QR Code Functions
  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = 'profileHash-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedData(data);
      setTokenId(data);
      setShowScanner(false);
    }
  };

  const handleScanError = (error: any) => {
    console.error('QR Scanner error:', error);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        // Here you could add logic to process the uploaded image
        // For now, we'll just display it
      };
      reader.readAsDataURL(file);
    }
  };

  // Verify Identity Functions
  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenId.trim()) return;

    setIsVerifyLoading(true);
    try {
      const dbCheck = await verifyProfileHash(tokenId);
      if (!dbCheck?.verified) {
        setVerifyResult({ error: 'Hash not found in database. Verification failed.' });
        return;
      }
      const data = await verifyCredential(tokenId);
      setVerifyResult({ verified: true, message: 'Verification successfully completed.', db: dbCheck, chain: data });
    } catch (error) {
      console.error('Verification failed:', error);
      setVerifyResult({ error: 'Verification failed. Please check the token ID and try again.' });
    } finally {
      setIsVerifyLoading(false);
    }
  }

  // Dashboard Functions
  async function onDashboardConnect() {
    setIsDashboardLoading(true);
    try {
      const r = await connectWallet();
      if (r) setAddress(r.address);
      try {
        const s = await getSignerInfo();
        setBackendSigner(s);
      } catch (e) {
        console.error('Failed to fetch backend signer:', e);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsDashboardLoading(false);
    }
  }

  async function onGrantIssuer() {
    if (!backendSigner?.address) return;
    setIsGranting(true);
    try {
      const res = await addIssuer(backendSigner.address);
      setDashboardResult(res);
      if (res?.success && res?.transaction?.status === 1) {
        setIssuerGranted(true);
      }
    } catch (e) {
      console.error('Failed to grant issuer:', e);
      setDashboardResult({ error: 'Failed to grant issuer. Check backend signer address and permissions.' });
    } finally {
      setIsGranting(false);
    }
  }

  async function onIssue(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;

    setIsDashboardLoading(true);
    try {
      const data = await issueCredential(
        to, 
        uri, 
        JSON.parse(payload),
        userEmail || undefined,
        userName || undefined,
        credentialType
      );
      setDashboardResult(data);
      if (data?.success && data?.transaction?.hash) {
        setIssueSuccess({ hash: data.transaction.hash });
      } else {
        setIssueSuccess(null);
      }
    } catch (error) {
      console.error('Failed to issue credential:', error);
      setDashboardResult({ error: 'Failed to issue credential. Please check your inputs and try again.' });
      setIssueSuccess(null);
    } finally {
      setIsDashboardLoading(false);
    }
  }

  async function onRequestAccess(e: React.FormEvent) {
    e.preventDefault();
    setIsRequesting(true);
    try {
      const data = await requestAccess(address, subject, JSON.parse(purpose));
      setRequestOut(data);
      if (data?.requestId) setReqId(data.requestId);
      try {
        const eth: any = (window as any).ethereum;
        if (eth && data?.requestId && subject) {
          const sig = await eth.request({
            method: 'personal_sign',
            params: [data.requestId, subject]
          });
          if (typeof sig === 'string') setSignature(sig);
        }
      } catch (_e) {
        // Ignore if user rejects or provider not available
      }
    } catch (error) {
      console.error('Failed to request access:', error);
      setRequestOut({ error: 'Failed to request access.' });
    } finally {
      setIsRequesting(false);
    }
  }

  async function onApproveAccess(e: React.FormEvent) {
    e.preventDefault();
    setIsApproving(true);
    try {
      if (!/^0x[0-9a-fA-F]{64}$/.test(reqId.trim())) {
        setApproveOut({ error: 'Invalid Request ID. Use the bytes32 value returned from Request Access (0x + 64 hex).' });
        return;
      }
      let accessAddress = CONTRACT_ADDRESSES.ACCESS_CONTROL;
      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        try {
          const baseURL = (import.meta as any).env.VITE_BACKEND_URL || 'https://chainid.onrender.com';
          const { data } = await axios.get(`${baseURL}/api/contracts/addresses`);
          accessAddress = data?.addresses?.accessControl || '';
        } catch (e) {
          // ignore
        }
      }
      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        setApproveOut({ error: 'ACCESS_CONTROL address not set.' });
        return;
      }
      const eth: any = (window as any).ethereum;
      if (!eth) throw new Error('No wallet provider');
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const access = createContractInstance(accessAddress, CONTRACT_ABIS.ACCESS_CONTROL, signer);
      try {
        const req = await (access as any).requestOf(reqId);
        const subjectOnChain: string = req?.subject || req?.[1] || '';
        const connected = (await signer.getAddress());
        if (!subjectOnChain || connected.toLowerCase() !== subjectOnChain.toLowerCase()) {
          setApproveOut({ error: `Please switch wallet to subject address ${subjectOnChain} to approve this request.` });
          return;
        }
      } catch (_e) {
        // proceed
      }
      const tx = await (access as any).approve(reqId as any, signature as any, (proof && proof !== '') ? proof : '0x');
      const receipt = await tx.wait();
      setApproveOut({ success: true, transaction: receipt });
    } catch (error) {
      console.error('Failed to approve access:', error);
      setApproveOut({ error: 'Failed to approve access.' });
    } finally {
      setIsApproving(false);
    }
  }

  async function onSignWithWallet() {
    try {
      setIsSigning(true);
      const eth: any = (window as any).ethereum;
      if (!eth) throw new Error('No wallet provider');
      if (!reqId || !address) throw new Error('Missing request ID or wallet');
      const sig = await eth.request({ method: 'personal_sign', params: [reqId, address] });
      if (typeof sig === 'string') setSignature(sig);
    } catch (e) {
      console.error('Failed to sign:', e);
    } finally {
      setIsSigning(false);
    }
  }

  async function onFetchAccessDetails() {
    try {
      setIsFetchingReq(true);
      setRequestDetails(null);
      if (!/^0x[0-9a-fA-F]{64}$/.test(reqId.trim())) {
        setRequestDetails({ error: 'Invalid Request ID. Use the bytes32 value from Request Access.' });
        return;
      }
      let accessAddress = CONTRACT_ADDRESSES.ACCESS_CONTROL;
      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        try {
          const baseURL = (import.meta as any).env.VITE_BACKEND_URL || 'https://chainid.onrender.com';
          const { data } = await axios.get(`${baseURL}/api/contracts/addresses`);
          accessAddress = data?.addresses?.accessControl || '';
        } catch { }
      }
      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        setRequestDetails({ error: 'ACCESS_CONTROL address not set.' });
        return;
      }
      const eth: any = (window as any).ethereum;
      if (!eth) {
        setRequestDetails({ error: 'No wallet provider found.' });
        return;
      }
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const access = createContractInstance(accessAddress, CONTRACT_ABIS.ACCESS_CONTROL, signer);
      const req = await (access as any).requestOf(reqId);
      const approved = await (access as any).isApproved(reqId);
      const details = {
        requester: req?.requester ?? req?.[0],
        subject: req?.subject ?? req?.[1],
        purposeHash: req?.purposeHash ?? req?.[2],
        timestamp: (req?.timestamp ?? req?.[3])?.toString?.() ?? '',
        approved
      };
      setRequestDetails(details);
    } catch (e) {
      console.error('Failed to fetch access details:', e);
      setRequestDetails({ error: 'Failed to fetch details.' });
    } finally {
      setIsFetchingReq(false);
    }
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
              <Link to="/government" className="text-indigo-400 font-semibold">
                Government
              </Link>
              <Link to="/telecommunication" className="text-slate-300 hover:text-white transition-colors">
                Telecommunication
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
              <BuildingIcon className="w-4 h-4 mr-2" />
              Government Portal
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="text-4xl md:text-5xl font-extrabold mb-6">
              Government <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">Identity Management</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-xl text-slate-300/80 max-w-3xl mx-auto">
              Create, verify, and manage digital identities for government services with blockchain security.
            </motion.p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900/60 rounded-lg p-1 border border-slate-800/60">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'create'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                <PersonIcon className="w-5 h-5 inline mr-2" />
                Create Identity
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'verify'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                <CheckIcon className="w-5 h-5 inline mr-2" />
                Verify Identity
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
                  }`}
              >
                <ChartIcon className="w-5 h-5 inline mr-2" />
                Dashboard
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-900/40 rounded-xl border border-slate-800/60 p-8">
            {activeTab === 'create' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-2xl font-bold mb-6 text-center">Create Government Identity</h3>
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 p-6 bg-indigo-950 rounded-xl border border-indigo-900">
                    <h4 className="text-lg font-semibold text-white mb-4">Step 1: Connect Your Wallet</h4>
                    <button
                      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${address
                        ? 'bg-green-700 text-green-100 border border-green-400'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      onClick={onConnect}
                      disabled={isCreateLoading}
                    >
                      {isCreateLoading ? 'Connecting...' : address ? 'Wallet Connected' : 'Connect Wallet'}
                    </button>
                    {address && (
                      <p className="mt-3 text-sm text-green-300">
                        Connected: {address.slice(0, 6)}...{address.slice(-4)}
                      </p>
                    )}
                  </div>

                  {address && (
                    <form className="space-y-6" onSubmit={onCreateSubmit}>
                      <h4 className="text-lg font-semibold text-white mb-4">Step 2: Enter Citizen  Information</h4>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-800 text-slate-100 border border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">National ID</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-800 text-slate-100 border border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Enter your national ID number"
                          value={nid}
                          onChange={e => setNid(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isCreateLoading || !name || !nid}
                      >
                        {isCreateLoading ? 'Creating Identity...' : 'Create Your Identity'}
                      </button>
                    </form>
                  )}

                  {createResult && (
                    <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-indigo-900 text-slate-100">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Registration Result
                        <button
                          type="button"
                          className="ml-2 p-1 rounded hover:bg-slate-700"
                          title="Copy to clipboard"
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(createResult, null, 2));
                          }}
                        >
                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" stroke="currentColor" />
                            <rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" stroke="currentColor" />
                          </svg>
                        </button>
                      </h4>
                      <pre className="text-sm p-4 rounded-lg border overflow-x-auto">
                        {JSON.stringify(createResult, null, 2)}
                      </pre>

                      {/* QR Code Download Section */}
                      {qrCodeDataUrl && createResult?.profileHash && (
                        <div className="mt-6 p-4 bg-indigo-950 rounded-lg border border-indigo-800">
                          <h5 className="text-md font-semibold mb-3 text-indigo-300">QR Code for ProfileHash</h5>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={qrCodeDataUrl}
                                alt="QR Code"
                                className="w-16 h-16 border border-indigo-600 rounded"
                              />
                              <div>
                                <p className="text-sm text-slate-300">ProfileHash: {createResult.profileHash}</p>
                                <p className="text-xs text-slate-400">Scan this QR code to verify your identity</p>
                              </div>
                            </div>
                            <button
                              onClick={downloadQRCode}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                              Download QR
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="text-indigo-400 font-bold mt-4">*Download this info for future use</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'verify' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-2xl font-bold mb-6 text-center">Verify Identity</h3>
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section - Image Upload */}
                    <div className="lg:col-span-1">
                      <div className="bg-slate-800 rounded-xl border border-indigo-900 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Upload Image</h4>
                        <div className="space-y-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full p-4 border-2 border-dashed border-indigo-600 rounded-lg text-indigo-300 hover:border-indigo-500 hover:text-indigo-200 transition-colors"
                          >
                            <div className="text-center">
                              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p>Click to upload image</p>
                            </div>
                          </button>
                          {uploadedImage && (
                            <div className="mt-4">
                              <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="w-full h-32 object-cover rounded-lg border border-indigo-600"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle Section - Input Field */}
                    <div className="lg:col-span-1">
                      <div className="bg-slate-800 rounded-xl border border-indigo-900 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Verification Input</h4>
                        <form className="space-y-4" onSubmit={onVerify}>
                          <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                              Profile Hash or Transaction Hash
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                              </div>
                              <input
                                className="w-full pl-10 pr-4 py-3 bg-slate-700 text-slate-100 border border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Paste your profileHash or txHash (0x + 64 hex)"
                                value={tokenId}
                                onChange={e => setTokenId(e.target.value)}
                                required
                              />
                            </div>
                            {scannedData && (
                              <p className="mt-2 text-sm text-green-400">
                                Scanned: {scannedData.slice(0, 20)}...
                              </p>
                            )}
                            <p className="mt-2 text-sm text-slate-400">
                              আপনি আপনার identity তৈরি করার সময় যে <strong>profileHash</strong> পেয়েছেন বা <strong>txHash</strong> পেয়েছেন, সেটি এখানে পেস্ট করুন।
                            </p>
                            {!tokenId.trim() || isValidHexHash(tokenId) ? null : (
                              <p className="mt-1 text-sm text-red-400">ইনপুটটি 0x দিয়ে শুরু হওয়া 64-হেক্স ক্যারেক্টারের হওয়া উচিত।</p>
                            )}
                          </div>

                          <button
                            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            type="submit"
                            disabled={isVerifyLoading || !isValidHexHash(tokenId)}
                          >
                            {isVerifyLoading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <CheckIcon className="w-5 h-5" />
                                <span>Verify Credential</span>
                              </>
                            )}
                          </button>
                          {
                            verifyResult && verifyResult.message && (
                              <p className="text-green-300 text-xl">{verifyResult.message}</p>
                            )
                          }
                        </form>

                        {verifyResult && (
                          <div className="mt-6 p-4 rounded-lg border transition-all">
                            {verifyResult.error ? (
                              <div className="bg-red-950 border-red-900">
                                <h5 className="text-md font-semibold text-red-400 mb-2">Verification Failed</h5>
                                <p className="text-red-300 text-sm">{verifyResult.error}</p>
                              </div>
                            ) : (
                              <div className="bg-green-950 border-green-900">
                                <h5 className="text-md font-semibold text-green-400 mb-2">Verification Result</h5>
                                <div className="bg-slate-800 p-3 rounded border border-green-900">
                                  <pre className="text-xs text-green-300 overflow-x-auto">
                                    {JSON.stringify(verifyResult, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - QR Code Scanner */}
                    <div className="lg:col-span-1">
                      <div className="bg-slate-800 rounded-xl border border-indigo-900 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">QR Code Scanner</h4>
                        <div className="space-y-4">
                          {!showScanner ? (
                            <button
                              onClick={() => setShowScanner(true)}
                              className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              <div className="text-center">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                <p>Start QR Scanner</p>
                              </div>
                            </button>
                          ) : (
                            <div className="space-y-4">
                              <div className="relative">
                                <QRScanner
                                  onScan={handleScan}
                                  onError={handleScanError}
                                  onClose={() => setShowScanner(false)}
                                />
                              </div>
                              <button
                                onClick={() => setShowScanner(false)}
                                className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                Stop Scanner
                              </button>
                            </div>
                          )}
                          {scannedData && (
                            <div className="mt-4 p-3 bg-green-950 border border-green-800 rounded-lg">
                              <p className="text-sm text-green-300">Scanned Data:</p>
                              <p className="text-xs text-green-200 break-all">{scannedData}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-2xl font-bold mb-6 text-center">Government Dashboard</h3>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-700/40">
                        <ChartIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Identity Management</h4>
                        <p className="text-slate-300">Issue credentials and manage access</p>
                      </div>
                    </div>
                    <button
                      className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${address
                        ? 'bg-green-700 text-green-100 border border-green-400'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      onClick={onDashboardConnect}
                      disabled={isDashboardLoading}
                    >
                      <WalletIcon />
                      <span>{isDashboardLoading ? 'Connecting...' : address ? 'Wallet Connected' : 'Connect Wallet'}</span>
                    </button>
                  </div>

                  {address && (
                    <div className="bg-slate-900 p-4 rounded-lg border border-indigo-900">
                      <p className="text-sm text-slate-300">
                        Connected Wallet: <span className="font-mono text-indigo-400">{address.slice(0, 6)}...{address.slice(-4)}</span>
                      </p>
                      {backendSigner?.address && (
                        <div className="mt-2 text-sm text-slate-300">
                          Backend Signer: <span className="font-mono text-blue-400">{backendSigner.address}</span>
                          {backendSigner.balance && <span className="ml-2">(Balance: {backendSigner.balance} ETH)</span>}
                          <button
                            type="button"
                            onClick={onGrantIssuer}
                            disabled={isGranting || issuerGranted}
                            className={`ml-3 inline-flex items-center px-3 py-1.5 rounded text-white text-xs disabled:opacity-50 ${issuerGranted ? 'bg-green-700' : 'bg-blue-700 hover:bg-blue-800'}`}
                          >
                            {issuerGranted ? 'Issuer Granted' : isGranting ? 'Granting...' : 'Grant Issuer Role'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                  {/* Issue Credential Section */}
                  <div className="bg-slate-800/40 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-700/40">
                        <DocumentIcon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white">Issue Credential (Issuer)</h4>
                    </div>
                    <form className="space-y-4" onSubmit={onIssue}>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Recipient Address</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-700 text-slate-100 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="0x..."
                          value={to}
                          onChange={e => setTo(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">User Email (for notification)</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-slate-700 text-slate-100 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="user@example.com"
                          value={userEmail}
                          onChange={e => setUserEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">User Name (for notification)</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-700 text-slate-100 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="John Doe"
                          value={userName}
                          onChange={e => setUserName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Credential Type</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-700 text-slate-100 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Government Credential"
                          value={credentialType}
                          onChange={e => setCredentialType(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Metadata URI</label>
                        <input
                          className="w-full px-4 py-3 bg-slate-700 text-slate-100 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="ipfs://..."
                          value={uri}
                          onChange={e => setUri(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Credential Payload (JSON)</label>
                        <textarea
                          className="w-full px-4 py-3 bg-slate-700 text-slate-100 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
                          rows={4}
                          value={payload}
                          onChange={e => setPayload(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isDashboardLoading || !address || !to || !uri || !payload}
                      >
                        {isDashboardLoading ? 'Issuing Credential...' : 'Issue Credential'}
                      </button>
                    </form>
                    {dashboardResult && (
                      <div className="mt-4 p-3 rounded border bg-slate-700">
                        <pre className="text-xs text-indigo-300 overflow-x-auto">{JSON.stringify(dashboardResult, null, 2)}</pre>
                      </div>
                    )}
                  </div>

                  {/* Access Control Section */}
                  <div className="bg-slate-800/40 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-6">Access Control</h4>
                    <div className="space-y-6">
                      {/* Request Access */}
                      <div>
                        <h5 className="text-md font-semibold text-slate-200 mb-3">Request Access</h5>
                        <form className="space-y-3" onSubmit={onRequestAccess}>
                          <input
                            className="w-full px-3 py-2 bg-slate-700 text-slate-100 border border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="Subject Address (0x...)"
                            required
                          />
                          <textarea
                            className="w-full px-3 py-2 bg-slate-700 text-slate-100 border border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-xs"
                            rows={2}
                            value={purpose}
                            onChange={e => setPurpose(e.target.value)}
                            placeholder='{"reason":"KYC verification"}'
                            required
                          />
                          <button
                            className="w-full bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
                            disabled={!address || isRequesting}
                          >
                            {isRequesting ? 'Requesting...' : 'Request Access'}
                          </button>
                        </form>
                        {requestOut && (
                          <div className="mt-3 p-2 rounded border bg-slate-700">
                            <pre className="text-xs text-indigo-300 overflow-x-auto">{JSON.stringify(requestOut, null, 2)}</pre>
                          </div>
                        )}
                      </div>

                      {/* Approve Access */}
                      <div>
                        <h5 className="text-md font-semibold text-slate-200 mb-3">Approve Access</h5>
                        <form className="space-y-3" onSubmit={onApproveAccess}>
                          <input
                            className="w-full px-3 py-2 bg-slate-700 text-slate-100 border border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            value={reqId}
                            onChange={e => setReqId(e.target.value)}
                            placeholder="Request ID (0x...)"
                            required
                          />
                          <div className="flex items-center gap-2">
                            <input
                              className="flex-1 px-3 py-2 bg-slate-700 text-slate-100 border border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                              value={signature}
                              onChange={e => setSignature(e.target.value)}
                              placeholder="Signature (0x...)"
                              required
                            />
                            <button
                              type="button"
                              onClick={onSignWithWallet}
                              disabled={!reqId || !address || isSigning}
                              className="px-3 py-2 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {isSigning ? 'Signing...' : 'Sign'}
                            </button>
                          </div>
                          <input
                            className="w-full px-3 py-2 bg-slate-700 text-slate-100 border border-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                            value={proof}
                            onChange={e => setProof(e.target.value)}
                            placeholder="Optional Proof (0x...)"
                          />
                          <button
                            className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-all disabled:opacity-50"
                            disabled={!address || isApproving}
                          >
                            {isApproving ? 'Approving...' : 'Approve Access'}
                          </button>
                        </form>
                        {approveOut && (
                          <div className="mt-3 p-2 rounded border bg-slate-700">
                            <pre className="text-xs text-green-300 overflow-x-auto">{JSON.stringify(approveOut, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
