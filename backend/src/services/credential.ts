import type { Request, Response } from "express";
import { credential, identity } from "./eth.ts";
import { ethers } from "ethers";
import crypto from "crypto";

export async function issueCredentialHandler(req: Request, res: Response) {
  try {
    const { to, metadataURI, payload } = req.body as { to: string; metadataURI: string; payload: unknown };
    if (!to || !metadataURI || !payload) return res.status(400).json({ error: "Missing fields" });
    
    // Validate and checksum the address
    let checksummedAddress: string;
    try {
      checksummedAddress = ethers.getAddress(to);
    } catch (error) {
      return res.status(400).json({ error: "Invalid Ethereum address format" });
    }
    
    // Optional: verify signer is issuer via identity contract off-chain
    const issuerRole = await identity.ISSUER_ROLE();
    const isIssuer = await identity.hasRole(issuerRole, await identity.signer.getAddress());
    if (!isIssuer) return res.status(403).json({ error: "Not authorized issuer" });

    const hash = "0x" + crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    const tx = await credential.issue(checksummedAddress, hash, metadataURI);
    const receipt = await tx.wait();
    res.json({ ok: true, txHash: receipt?.hash });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
