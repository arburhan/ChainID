import axios from 'axios'
import { ethers } from 'ethers'

const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://chainid.onrender.com'
export const api = axios.create({ baseURL })

export async function register(address: string, profile: any) {
  // Ensure address is properly checksummed
  const checksummedAddress = ethers.getAddress(address)

  const { data } = await api.post('/api/register', { address: checksummedAddress, profile })
  return data
}

export async function issueCredential(to: string, metadataURI: string, payload: any, userEmail?: string, userName?: string, credentialType?: string) {
  // Compute bytes32 hash for credentialHash from the URI
  const credentialHash = ethers.keccak256(ethers.toUtf8Bytes(metadataURI))
  const { data } = await api.post('/api/contracts/credential/issue', { 
    to, 
    credentialHash, 
    uri: metadataURI,
    userEmail,
    userName,
    credentialType
  })
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
  // Hash purpose JSON to bytes32 for on-chain call
  const purposeHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(purpose)))
  const { data } = await api.post('/api/contracts/access/request', { 
    subject, 
    purposeHash,
    requester,
    purpose: JSON.stringify(purpose)
  })
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

export async function verifyProfileHash(profileHash: string) {
  const { data } = await api.post('/api/verifyProfileHash', { profileHash })
  return data
}

// User API functions
export async function registerUser(walletAddress: string, email: string, name: string, phone?: string) {
  const { data } = await api.post('/api/user/register', { walletAddress, email, name, phone })
  return data
}

export async function getUser(walletAddress: string) {
  const { data } = await api.get(`/api/user/${walletAddress}`)
  return data
}

export async function updateUser(walletAddress: string, email?: string, name?: string, phone?: string) {
  const { data } = await api.put(`/api/user/${walletAddress}`, { email, name, phone })
  return data
}

export async function getUserCredentials(walletAddress: string) {
  const { data } = await api.get(`/api/user/${walletAddress}/credentials`)
  return data
}

export async function getUserAccessRequests(walletAddress: string) {
  const { data } = await api.get(`/api/user/${walletAddress}/access-requests`)
  return data
}