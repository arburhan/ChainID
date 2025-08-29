import { useState } from 'react'
import { connectWallet } from '../lib/wallet'
import { register } from '../lib/api'
import { Link } from 'react-router-dom'

// Icon components
const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

export function Register() {
  const [address, setAddress] = useState<string>('')
  const [name, setName] = useState('')
  const [nid, setNid] = useState('')
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) return;
    setIsLoading(true);
    try {
      const profile = { name, nid };
      // address is already checksummed from connectWallet
      const data = await register(address, profile);
      setResult(data);
    } catch (error) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;
      setResult({ error: errorMessage || 'Registration failed' });
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100">
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-700/40">
                <span className="text-white font-bold text-lg">Ξ</span>
              </div>
              <span className="text-2xl font-bold">ChainID</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <ArrowLeftIcon />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-slate-900 rounded-2xl shadow-lg border border-indigo-900 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-700/40">
              <ShieldIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Digital Identity</h1>
            <p className="text-slate-300">Register your decentralized identifier on the Ethereum blockchain</p>
          </div>

          <div className="mb-8 p-6 bg-indigo-950 rounded-xl border border-indigo-900">
            <h2 className="text-lg font-semibold text-white mb-4">Step 1: Connect Your Wallet</h2>
            <button
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${address
                ? 'bg-green-700 text-green-100 border border-green-400'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              onClick={onConnect}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : address ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
            {address && (
              <p className="mt-3 text-sm text-green-300">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
          </div>

          {address && (
            <form className="space-y-6" onSubmit={onSubmit}>
              <h2 className="text-lg font-semibold text-white mb-4">Step 2: Enter Your Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-slate-800 text-slate-100 border border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  National ID
                </label>
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
                disabled={isLoading || !name || !nid}
              >
                {isLoading ? 'Creating Identity...' : 'Create Your Identity'}
              </button>
            </form>
          )}

          {result && (
            <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-indigo-900 text-slate-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Registration Result
                <button
                  type="button"
                  className="ml-2 p-1 rounded hover:bg-slate-700"
                  title="Copy to clipboard"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                  }}
                >
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2" stroke="currentColor" />
                    <rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2" stroke="currentColor" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="ml-2 p-1 rounded hover:bg-slate-700"
                  title="Download as .txt"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'registration_result.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeWidth="2" d="M12 16v-8m0 8l-4-4m4 4l4-4" />
                    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" stroke="currentColor" />
                  </svg>
                </button>
              </h3>
              <pre className="text-sm p-4 rounded-lg border overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              <p className="text-indigo-400 font-bold">*Download this info for future use</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
