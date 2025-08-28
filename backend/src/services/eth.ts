import { ethers } from "ethers";
import fs from "fs";
import path from "path";

function loadArtifact(name: string) {
  const p = path.resolve(process.cwd(), "../contracts/artifacts/contracts/" + name + ".sol/" + name + ".json");
  const json = JSON.parse(fs.readFileSync(p, "utf-8"));
  return json.abi as any[];
}

// Lazy-load provider and signer
let _provider: ethers.JsonRpcProvider | null = null;
let _signer: ethers.Wallet | null = null;

function getProvider(): ethers.JsonRpcProvider {
  if (!_provider) {
    const rpcUrl = process.env.SEPOLIA_RPC_URL || "";
    if (!rpcUrl) throw new Error("Missing SEPOLIA_RPC_URL");
    _provider = new ethers.JsonRpcProvider(rpcUrl);
  }
  return _provider;
}

function getSigner(): ethers.Wallet {
  if (!_signer) {
    const pk = normalizePrivateKey(process.env.SEPOLIA_PRIVATE_KEY || "");
    _signer = new ethers.Wallet(pk, getProvider());
  }
  return _signer;
}

function normalizePrivateKey(maybeKey: string): string {
  const trimmed = (maybeKey || "").trim();
  if (!trimmed) throw new Error("Missing SEPOLIA_PRIVATE_KEY");
  return trimmed.startsWith("0x") ? trimmed : ("0x" + trimmed);
}

function getAddress(varNamePrimary: string, varNameAlt?: string): string {
  const val = (process.env[varNamePrimary] || (varNameAlt ? process.env[varNameAlt] : "") || "").trim();
  if (!val) {
    throw new Error(`Missing contract address env: ${varNamePrimary}${varNameAlt ? ` (or ${varNameAlt})` : ""}`);
  }
  // Normalize and checksum the address. Accept lowercase, fix bad checksum casing.
  try {
    return ethers.getAddress(val);
  } catch {
    // If checksum casing is wrong, try lowercasing then checksum
    try {
      return ethers.getAddress(val.toLowerCase());
    } catch (e) {
      throw new Error(`Invalid contract address for ${varNamePrimary}: ${val}`);
    }
  }
}

// Lazy-load contracts
export function getIdentityContract() {
  const identityAddress = getAddress("IDENTITY_CONTRACT", "IDENTITY_CONTRACT_ADDRESS");
  return new ethers.Contract(identityAddress, loadArtifact("IdentityContract"), getSigner());
}

export function getCredentialContract() {
  const credentialAddress = getAddress("CREDENTIAL_CONTRACT", "CREDENTIAL_CONTRACT_ADDRESS");
  return new ethers.Contract(credentialAddress, loadArtifact("CredentialContract"), getSigner());
}

export function getAccessControlContract() {
  const accessAddress = getAddress("ACCESS_CONTROL_CONTRACT", "ACCESS_CONTROL_CONTRACT_ADDRESS");
  return new ethers.Contract(accessAddress, loadArtifact("AccessControlContract"), getSigner());
}

export function getAuditContract() {
  const auditAddress = getAddress("AUDIT_CONTRACT", "AUDIT_CONTRACT_ADDRESS");
  return new ethers.Contract(auditAddress, loadArtifact("AuditContract"), getSigner());
}

// Legacy exports for backward compatibility - these are getter functions now
export const provider = getProvider;
export const signer = getSigner;
export const identity = getIdentityContract;
export const credential = getCredentialContract;
export const accessCtrl = getAccessControlContract;
export const audit = getAuditContract;
