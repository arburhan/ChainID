import { BrowserProvider } from 'ethers'

export async function connectWallet(): Promise<{ address: string; provider: BrowserProvider } | null> {
  const anyWindow = window as any
  if (!anyWindow.ethereum) return null
  const provider = new BrowserProvider(anyWindow.ethereum)
  const accounts: string[] = await anyWindow.ethereum.request({ method: 'eth_requestAccounts' })
  return { address: accounts[0], provider }
}
