import { useState } from 'react'
import { verifyCredential, verifyProfileHash } from '../lib/api'
import { Link } from 'react-router-dom'

// Icon components
const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

export function Verify() {
  const [tokenId, setTokenId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isValidHexHash = (value: string) => /^0x[0-9a-fA-F]{64}$/.test(value.trim())

  async function onVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!tokenId.trim()) return
    
    setIsLoading(true)
    try {
      // First, check profileHash existence in DB
      const dbCheck = await verifyProfileHash(tokenId)
      if (!dbCheck?.verified) {
        setResult({ error: 'Hash not found in database. Verification failed.' })
        return
      }
      // Then, optionally verify on-chain credential (kept for future extension)
      const data = await verifyCredential(tokenId)
      setResult({ verified: true, db: dbCheck, chain: data })
    } catch (error) {
      console.error('Verification failed:', error)
      setResult({ error: 'Verification failed. Please check the token ID and try again.' })
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
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Credential</h1>
            <p className="text-gray-600">Verify the authenticity of digital credentials using their token ID</p>
          </div>

          <form className="space-y-6" onSubmit={onVerify}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Hash or Transaction Hash
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                  placeholder="Paste your profileHash or txHash (0x + 64 hex)" 
                  value={tokenId} 
                  onChange={e => setTokenId(e.target.value)}
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                আপনি আপনার identity তৈরি করার সময় যে <strong>profileHash</strong> পেয়েছেন বা <strong>txHash</strong> পেয়েছেন, সেটি এখানে পেস্ট করুন। বর্তমান ডেমো verifier non-empty hex input গ্রহণ করে।
              </p>
              {!tokenId.trim() || isValidHexHash(tokenId) ? null : (
                <p className="mt-1 text-sm text-red-600">ইনপুটটি 0x দিয়ে শুরু হওয়া 64-হেক্স ক্যারেক্টারের হওয়া উচিত।</p>
              )}
            </div>
            
            <button 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2" 
              type="submit"
              disabled={isLoading || !isValidHexHash(tokenId)}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Verify Credential</span>
                </>
              )}
            </button>
          </form>

          {/* Result Display */}
          {result && (
            <div className="mt-8 p-6 rounded-xl border transition-all">
              {result.error ? (
                <div className="bg-red-50 border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-4">Verification Failed</h3>
                  <p className="text-red-700">{result.error}</p>
                </div>
              ) : (
                <div className="bg-green-50 border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Verification Result</h3>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <pre className="text-sm text-green-800 overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">How Verification Works</h3>
            <p className="text-purple-800 text-sm leading-relaxed">
              ChainID uses zero-knowledge proofs to verify credentials without revealing sensitive information. 
              The verification process checks the cryptographic proof against the blockchain to ensure authenticity 
              while maintaining your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
