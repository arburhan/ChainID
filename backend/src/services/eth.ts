import { ethers } from "ethers";
import fs from "fs";
import path from "path";

function loadArtifact(name: string) {
  const p = path.resolve(process.cwd(), "../contracts/artifacts/contracts/" + name + ".sol/" + name + ".json");
  const json = JSON.parse(fs.readFileSync(p, "utf-8"));
  return json.abi as any[];
}

const rpcUrl = process.env.SEPOLIA_RPC_URL || "";
if (!rpcUrl) throw new Error("Missing SEPOLIA_RPC_URL");

export const provider = new ethers.JsonRpcProvider(rpcUrl);
const pk = process.env.SEPOLIA_PRIVATE_KEY || "";
if (!pk) throw new Error("Missing SEPOLIA_PRIVATE_KEY");
export const signer = new ethers.Wallet(pk, provider);

const identityAddress = process.env.IDENTITY_CONTRACT || "";
const credentialAddress = process.env.CREDENTIAL_CONTRACT || "";
const accessAddress = process.env.ACCESS_CONTROL_CONTRACT || "";
const auditAddress = process.env.AUDIT_CONTRACT || "";

export const identity = new ethers.Contract(identityAddress, loadArtifact("IdentityContract"), signer);
export const credential = new ethers.Contract(credentialAddress, loadArtifact("CredentialContract"), signer);
export const accessCtrl = new ethers.Contract(accessAddress, loadArtifact("AccessControlContract"), signer);
export const audit = new ethers.Contract(auditAddress, loadArtifact("AuditContract"), signer);
