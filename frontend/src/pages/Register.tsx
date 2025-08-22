import { useState } from 'react'
import { connectWallet } from '../lib/wallet'
import { register } from '../lib/api'

export function Register() {
  const [address, setAddress] = useState<string>('')
  const [name, setName] = useState('')
  const [nid, setNid] = useState('')
  const [result, setResult] = useState<any>(null)

  async function onConnect() {
    const r = await connectWallet()
    if (r) setAddress(r.address)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address) return
    const profile = { name, nid }
    const data = await register(address, profile)
    setResult(data)
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Register DID</h1>
      <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={onConnect}>Connect Wallet</button>
      {address && <p className="mt-2 text-sm">Connected: {address}</p>}
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <input className="w-full border p-2 rounded" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="National ID" value={nid} onChange={e=>setNid(e.target.value)} />
        <button className="px-4 py-2 bg-green-600 text-white rounded" type="submit">Register</button>
      </form>
      {result && <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
