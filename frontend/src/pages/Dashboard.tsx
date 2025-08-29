import { useState } from 'react'
import { connectWallet } from '../lib/wallet'
import { issueCredential, getSignerInfo, addIssuer, requestAccess } from '../lib/api'
import { ethers } from 'ethers'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES, createContractInstance } from '../lib/contracts'
import axios from 'axios'
import { Link } from 'react-router-dom'

// Icon components
const ChartBarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
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

export function Dashboard() {
  const [address, setAddress] = useState('')
  const [to, setTo] = useState('')
  const [uri, setUri] = useState('ipfs://example')
  const [payload, setPayload] = useState('{"type":"KYC","level":"basic"}')
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [backendSigner, setBackendSigner] = useState<{address?: string, balance?: string} | null>(null)
  const [isGranting, setIsGranting] = useState(false)
  const [issuerGranted, setIssuerGranted] = useState(false)
  const [issueSuccess, setIssueSuccess] = useState<{ hash?: string } | null>(null)
  // Access request/approve state
  const [subject, setSubject] = useState('')
  const [purpose, setPurpose] = useState('{"reason":"KYC verification"}')
  const [requestOut, setRequestOut] = useState<any>(null)
  const [reqId, setReqId] = useState('')
  const [signature, setSignature] = useState('')
  const [proof, setProof] = useState('')
  const [approveOut, setApproveOut] = useState<any>(null)
  const [isRequesting, setIsRequesting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isSigning, setIsSigning] = useState(false)

  async function onConnect() {
    setIsLoading(true)
    try {
      const r = await connectWallet()
      if (r) setAddress(r.address)
      // fetch backend signer info
      try {
        const s = await getSignerInfo()
        setBackendSigner(s)
      } catch (e) {
        console.error('Failed to fetch backend signer:', e)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onGrantIssuer() {
    if (!backendSigner?.address) return
    setIsGranting(true)
    try {
      const res = await addIssuer(backendSigner.address)
      setResult(res)
      if (res?.success && res?.transaction?.status === 1) {
        setIssuerGranted(true)
      }
    } catch (e) {
      console.error('Failed to grant issuer:', e)
      setResult({ error: 'Failed to grant issuer. Check backend signer address and permissions.' })
    } finally {
      setIsGranting(false)
    }
  }

  async function onIssue(e: React.FormEvent) {
    e.preventDefault()
    if (!address) return
    
    setIsLoading(true)
    try {
      const data = await issueCredential(to, uri, JSON.parse(payload))
      setResult(data)
      if (data?.success && data?.transaction?.hash) {
        setIssueSuccess({ hash: data.transaction.hash })
      } else {
        setIssueSuccess(null)
      }
    } catch (error) {
      console.error('Failed to issue credential:', error)
      setResult({ error: 'Failed to issue credential. Please check your inputs and try again.' })
      setIssueSuccess(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function onRequestAccess(e: React.FormEvent) {
    e.preventDefault()
    setIsRequesting(true)
    try {
      const data = await requestAccess(address, subject, JSON.parse(purpose))
      setRequestOut(data)
      if (data?.requestId) setReqId(data.requestId)
      // Auto-generate signature with subject wallet if available
      try {
        const eth: any = (window as any).ethereum
        if (eth && data?.requestId && subject) {
          const sig = await eth.request({
            method: 'personal_sign',
            params: [data.requestId, subject]
          })
          if (typeof sig === 'string') setSignature(sig)
        }
      } catch (_e) {
        // Ignore if user rejects or provider not available; manual entry stays supported
      }
    } catch (error) {
      console.error('Failed to request access:', error)
      setRequestOut({ error: 'Failed to request access.' })
    } finally {
      setIsRequesting(false)
    }
  }

  async function onApproveAccess(e: React.FormEvent) {
    e.preventDefault()
    setIsApproving(true)
    try {
      // Validate requestId format (bytes32)
      if (!/^0x[0-9a-fA-F]{64}$/.test(reqId.trim())) {
        setApproveOut({ error: 'Invalid Request ID. Use the bytes32 value returned from Request Access (0x + 64 hex).' })
        return
      }
      // Resolve access control contract address (env or backend fallback)
      let accessAddress = CONTRACT_ADDRESSES.ACCESS_CONTROL
      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        try {
          const baseURL = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:4000'
          const { data } = await axios.get(`${baseURL}/api/contracts/addresses`)
          accessAddress = data?.addresses?.accessControl || ''
        } catch (e) {
          // ignore, will be validated below
        }
      }
      if (!accessAddress || !ethers.isAddress(accessAddress)) {
        setApproveOut({ error: 'ACCESS_CONTROL address not set. Set VITE_ACCESS_CONTROL_CONTRACT_ADDRESS or ensure backend /api/contracts/addresses works.' })
        return
      }
      const eth: any = (window as any).ethereum
      if (!eth) throw new Error('No wallet provider')
      const provider = new ethers.BrowserProvider(eth)
      const signer = await provider.getSigner()
      const access = createContractInstance(accessAddress, CONTRACT_ABIS.ACCESS_CONTROL, signer)
      // Ensure the connected wallet IS the subject for this requestId
      try {
        const req = await (access as any).requestOf(reqId)
        const subjectOnChain: string = req?.subject || req?.[1] || ''
        const connected = (await signer.getAddress())
        if (!subjectOnChain || connected.toLowerCase() !== subjectOnChain.toLowerCase()) {
          setApproveOut({ error: `Please switch wallet to subject address ${subjectOnChain} to approve this request.` })
          return
        }
      } catch (_e) {
        // If we cannot read, proceed; contract call will still enforce and revert if wrong
      }
      const tx = await (access as any).approve(reqId as any, signature as any, (proof && proof !== '') ? proof : '0x')
      const receipt = await tx.wait()
      setApproveOut({ success: true, transaction: receipt })
    } catch (error) {
      console.error('Failed to approve access:', error)
      setApproveOut({ error: 'Failed to approve access.' })
    } finally {
      setIsApproving(false)
    }
  }

  async function onSignWithWallet() {
    try {
      setIsSigning(true)
      const eth: any = (window as any).ethereum
      if (!eth) throw new Error('No wallet provider')
      if (!reqId || !address) throw new Error('Missing request ID or wallet')
      const sig = await eth.request({ method: 'personal_sign', params: [reqId, address] })
      if (typeof sig === 'string') setSignature(sig)
    } catch (e) {
      console.error('Failed to sign:', e)
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                <ArrowLeftIcon />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">ChainID</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ChainID Dashboard</h1>
                <p className="text-gray-600">Manage your digital identity and issue credentials</p>
              </div>
            </div>
            
            <button 
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                address 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`} 
              onClick={onConnect}
              disabled={isLoading}
            >
              <WalletIcon />
              <span>{isLoading ? 'Connecting...' : address ? 'Wallet Connected' : 'Connect Wallet'}</span>
            </button>
          </div>

          {address && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Connected Wallet: <span className="font-mono text-purple-600">{address.slice(0, 6)}...{address.slice(-4)}</span>
              </p>
              {backendSigner?.address && (
                <div className="mt-2 text-sm text-gray-600">
                  Backend Signer: <span className="font-mono text-blue-600">{backendSigner.address}</span>
                  {backendSigner.balance && <span className="ml-2">(Balance: {backendSigner.balance} ETH)</span>}
                  <button
                    type="button"
                    onClick={onGrantIssuer}
                    disabled={isGranting || issuerGranted}
                    className={`ml-3 inline-flex items-center px-3 py-1.5 rounded text-white text-xs disabled:opacity-50 ${issuerGranted ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Issue Credential (Issuer)</h2>
            </div>
            
            <form className="space-y-4" onSubmit={onIssue}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Address
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                  placeholder="0x..." 
                  value={to} 
                  onChange={e => setTo(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metadata URI
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                  placeholder="ipfs://..." 
                  value={uri} 
                  onChange={e => setUri(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential Payload (JSON)
                </label>
                <textarea 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono text-sm" 
                  rows={4} 
                  value={payload} 
                  onChange={e => setPayload(e.target.value)}
                  required
                />
              </div>
              
              <button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading || !address || !to || !uri || !payload}
              >
                {isLoading ? 'Issuing Credential...' : 'Issue Credential'}
              </button>
            </form>

            {/* Result Display */}
            {result && (
              <div className="mt-6 p-4 rounded-lg border transition-all">
                {result.error ? (
                  <div className="bg-red-50 border-red-200">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">Error</h3>
                    <p className="text-red-700 text-sm">{result.error}</p>
                  </div>
                ) : (
                  <div className="bg-green-50 border-green-200">
                    <h3 className="text-sm font-semibold text-green-800 mb-2">{issueSuccess ? 'Credential Issued Successfully' : 'Operation Successful'}</h3>
                    {issueSuccess?.hash && (
                      <p className="text-green-800 text-sm mb-2">Tx Hash: <span className="font-mono">{issueSuccess.hash}</span></p>
                    )}
                    <div className="bg-white p-3 rounded border border-green-200">
                      <pre className="text-xs text-green-800 overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Get Started Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Get Started</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">Register your DID</Link> on the Register page
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Have an issuer address issue credentials to you using the form on the left
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Respond to access requests with your signature and manage your identity
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Need Help?</h3>
              <p className="text-purple-800 text-sm leading-relaxed">
                Check out our documentation or contact support if you need assistance with 
                setting up your digital identity or issuing credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Access Request / Approve Section */}
        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Access</h2>
            <form className="space-y-4" onSubmit={onRequestAccess}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Address</label>
                <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" value={subject} onChange={e => setSubject(e.target.value)} placeholder="0x..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose (JSON)</label>
                <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors font-mono text-sm" rows={3} value={purpose} onChange={e => setPurpose(e.target.value)} required />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition-all disabled:opacity-50" disabled={!address || isRequesting}>{isRequesting ? 'Requesting...' : 'Request Access'}</button>
            </form>
            {requestOut && (
              <div className="mt-4 p-3 rounded border bg-gray-50">
                <pre className="text-xs text-gray-800 overflow-x-auto">{JSON.stringify(requestOut, null, 2)}</pre>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Approve Access</h2>
            <form className="space-y-4" onSubmit={onApproveAccess}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request ID</label>
                <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" value={reqId} onChange={e => setReqId(e.target.value)} placeholder="0x..." required />
              </div>
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
                <button type="button" onClick={onSignWithWallet} disabled={!reqId || !address || isSigning} className="ml-auto px-3 py-2 rounded bg-purple-600 text-white text-xs hover:bg-purple-700 disabled:opacity-50">{isSigning ? 'Signing...' : 'Sign with Wallet'}</button>
              </div>
              <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" value={signature} onChange={e => setSignature(e.target.value)} placeholder="0x..." required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Optional Proof (bytes hex)</label>
                <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" value={proof} onChange={e => setProof(e.target.value)} placeholder="0x..." />
              </div>
              <button className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-900 transition-all disabled:opacity-50" disabled={!address || isApproving}>{isApproving ? 'Approving...' : 'Approve Access'}</button>
            </form>
            {approveOut && (
              <div className="mt-4 p-3 rounded border bg-gray-50">
                <pre className="text-xs text-gray-800 overflow-x-auto">{JSON.stringify(approveOut, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
