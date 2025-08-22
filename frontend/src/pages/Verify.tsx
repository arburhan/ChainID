import { useState } from 'react'
import { verifyCredential } from '../lib/api'

export function Verify() {
  const [tokenId, setTokenId] = useState('')
  const [result, setResult] = useState<any>(null)

  async function onVerify(e: React.FormEvent) {
    e.preventDefault()
    const data = await verifyCredential(tokenId)
    setResult(data)
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Verify Credential</h1>
      <form className="space-y-2" onSubmit={onVerify}>
        <input className="w-full border p-2 rounded" placeholder="Token ID" value={tokenId} onChange={e=>setTokenId(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Verify</button>
      </form>
      {result && <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
