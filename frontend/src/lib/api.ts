import axios from 'axios'
import { ethers } from 'ethers'

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export const api = axios.create({ baseURL })

export async function register(address: string, profile: any) {
  // Ensure address is properly checksummed
  const checksummedAddress = ethers.getAddress(address)

  const { data } = await api.post('/api/register', { address: checksummedAddress, profile })
  return data
}

export async function issueCredential(to: string, metadataURI: string, payload: any) {
  const { data } = await api.post('/api/contracts/credential/issue', { to, credentialHash: metadataURI, uri: metadataURI })
  return data
}

export async function requestAccess(requester: string, subject: string, purpose: any) {
  const { data } = await api.post('/api/contracts/access/request', { subject, purposeHash: purpose })
  return data
}

export async function consent(requestId: string, subject: string, signature: string, optionalProof?: string) {
  const { data } = await api.post('/api/contracts/access/approve', { requestId, signature, proof: optionalProof })
  return data
}

export async function verifyCredential(tokenId: string) {
  const { data } = await api.post('/api/contracts/verifier/verify', { proof: tokenId, signalHash: tokenId })
  return data
}
