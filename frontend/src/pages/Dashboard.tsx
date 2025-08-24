import { useState } from 'react'
import { connectWallet } from '../lib/wallet'
import { issueCredential } from '../lib/api'
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

  async function onConnect() {
    setIsLoading(true)
    try {
      const r = await connectWallet()
      if (r) setAddress(r.address)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function onIssue(e: React.FormEvent) {
    e.preventDefault()
    if (!address) return
    
    setIsLoading(true)
    try {
      const data = await issueCredential(to, uri, JSON.parse(payload))
      setResult(data)
    } catch (error) {
      console.error('Failed to issue credential:', error)
      setResult({ error: 'Failed to issue credential. Please check your inputs and try again.' })
    } finally {
      setIsLoading(false)
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
                    <h3 className="text-sm font-semibold text-green-800 mb-2">Credential Issued Successfully</h3>
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
      </div>
    </div>
  )
}
