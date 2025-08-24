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
    e.preventDefault()
    if (!address) return
    setIsLoading(true)
    try {
      const profile = { name, nid }
      const data = await register(address, profile)
      setResult(data)
    } catch (error) {
      console.error('Registration failed:', error)
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
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Digital Identity</h1>
            <p className="text-gray-600">Register your decentralized identifier on the Ethereum blockchain</p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Connect Your Wallet</h2>
            <button 
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                address 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`} 
              onClick={onConnect}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : address ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
            {address && (
              <p className="mt-3 text-sm text-green-700">
                Connected: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
          </div>

          {/* Registration Form */}
          {address && (
            <form className="space-y-6" onSubmit={onSubmit}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Enter Your Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                  placeholder="Enter your national ID number" 
                  value={nid} 
                  onChange={e => setNid(e.target.value)}
                  required
                />
              </div>
              
              <button 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading || !name || !nid}
              >
                {isLoading ? 'Creating Identity...' : 'Create Your Identity'}
              </button>
            </form>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Result</h3>
              <pre className="text-sm bg-white p-4 rounded-lg border overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
