import type { Request, Response } from "express";
import { credential } from "./eth.ts";
import { ProfileModel } from "../models/Profile";

export async function verifyCredentialHandler(req: Request, res: Response) {
  try {
    const { tokenId } = req.body as { tokenId: string };
    if (!tokenId) return res.status(400).json({ error: "Missing tokenId" });
    const token = BigInt(tokenId);
    const owner = await credential.ownerOf(token);
    const hash = await credential.credentialHashOf(token);
    res.json({ owner, credentialHash: hash });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function verifyProfileHashHandler(req: Request, res: Response) {
  try {
    const { profileHash } = req.body as { profileHash: string };
    if (!profileHash) return res.status(400).json({ error: "Missing profileHash" });
    const isHex64 = /^0x[0-9a-fA-F]{64}$/.test(profileHash);
    if (!isHex64) return res.status(400).json({ error: "profileHash must be 0x-prefixed 32-byte hex" });

    const doc = await ProfileModel.findOne({ profileHash }).lean();
    if (!doc) {
      return res.json({ verified: false, reason: "profileHash not found in database" });
    }
    // Optionally, more checks can be added here (e.g., on-chain cross-checks)
    return res.json({ verified: true, address: doc.address, profileHash: doc.profileHash, createdAt: doc.createdAt });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
