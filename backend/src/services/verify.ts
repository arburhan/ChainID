import type { Request, Response } from "express";
import { credential } from "./eth.ts";

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
