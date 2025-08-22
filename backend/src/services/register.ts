import type { Request, Response } from "express";
import { encryptJson } from "./crypto.ts";
import { ProfileModel } from "../models/Profile.ts";
import { identity } from "./eth.ts";
import { ethers } from "ethers";
import crypto from "crypto";

export async function registerHandler(req: Request, res: Response) {
  try {
    const { address, profile } = req.body as { address: string; profile: Record<string, unknown> };
    if (!address || !profile) return res.status(400).json({ error: "Missing address/profile" });

    const enc = encryptJson(profile);
    const profileHash = "0x" + crypto.createHash("sha256").update(JSON.stringify(enc)).digest("hex");

    await ProfileModel.findOneAndUpdate(
      { address: ethers.getAddress(address) },
      { address: ethers.getAddress(address), profile: enc, profileHash },
      { upsert: true }
    );

    const tx = await identity.registerDID(profileHash);
    const receipt = await tx.wait();
    res.json({ ok: true, txHash: receipt?.hash, profileHash });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
