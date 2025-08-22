import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export const api = axios.create({ baseURL })

export async function register(address: string, profile: any) {
  const { data } = await api.post('/register', { address, profile })
  return data
}

export async function issueCredential(to: string, metadataURI: string, payload: any) {
  const { data } = await api.post('/issueCredential', { to, metadataURI, payload })
  return data
}

export async function requestAccess(requester: string, subject: string, purpose: any) {
  const { data } = await api.post('/requestAccess', { requester, subject, purpose })
  return data
}

export async function consent(requestId: string, subject: string, signature: string, optionalProof?: string) {
  const { data } = await api.post('/consent', { requestId, subject, signature, optionalProof })
  return data
}

export async function verifyCredential(tokenId: string) {
  const { data } = await api.post('/verifyCredential', { tokenId })
  return data
}
