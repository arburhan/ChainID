import { useState } from 'react'
import { connectWallet } from '../lib/wallet'
import { issueCredential } from '../lib/api'

export function Dashboard() {
  const [address, setAddress] = useState('')
  const [to, setTo] = useState('')
  const [uri, setUri] = useState('ipfs://example')
  const [payload, setPayload] = useState('{"type":"KYC","level":"basic"}')
  const [result, setResult] = useState<any>(null)

  async function onConnect() {
    const r = await connectWallet()
    if (r) setAddress(r.address)
  }

  async function onIssue(e: React.FormEvent) {
    e.preventDefault()
    const data = await issueCredential(to, uri, JSON.parse(payload))
    setResult(data)
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ChainID Dashboard</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={onConnect}>{address? 'Connected' : 'Connect Wallet'}</button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Issue Credential (Issuer)</h2>
          <form className="space-y-2" onSubmit={onIssue}>
            <input className="w-full border p-2 rounded" placeholder="Recipient address" value={to} onChange={e=>setTo(e.target.value)} />
            <input className="w-full border p-2 rounded" placeholder="Metadata URI" value={uri} onChange={e=>setUri(e.target.value)} />
            <textarea className="w-full border p-2 rounded" rows={4} value={payload} onChange={e=>setPayload(e.target.value)} />
            <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Issue</button>
          </form>
          {result && <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Get Started</h2>
          <ul className="list-disc ml-5 text-sm">
            <li>Register your DID on the Register page</li>
            <li>Have an issuer address issue credentials to you</li>
            <li>Respond to access requests with your signature</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
