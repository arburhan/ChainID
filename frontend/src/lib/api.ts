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
  // Compute bytes32 hash for credentialHash from the URI
  const credentialHash = ethers.keccak256(ethers.toUtf8Bytes(metadataURI))
  const { data } = await api.post('/api/contracts/credential/issue', { to, credentialHash, uri: metadataURI })
  return data
}

export async function getSignerInfo() {
  const { data } = await api.get('/api/contracts/signer')
  return data
}

export async function addIssuer(account: string) {
  const { data } = await api.post('/api/contracts/identity/add-issuer', { account })
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
