import type { Request, Response } from "express";
import { encryptJson } from "./crypto";
import { ProfileModel } from "../models/Profile";
import { identity } from "./eth";
import { ethers } from "ethers";
import crypto from "crypto";

export async function registerHandler(req: Request, res: Response) {
  try {
    const { address, profile } = req.body as { address: string; profile: Record<string, unknown> };

    console.log(address, profile);
    if (!address || !profile) return res.status(400).json({ error: "Missing address/profile" });

    // Validate and checksum the address
    let checksummedAddress: string;
    try {
      checksummedAddress = ethers.getAddress(address);
    } catch (error) {
      return res.status(400).json({ error: "Invalid Ethereum address format" });
    }

    const enc = encryptJson(profile);
    const profileHash = "0x" + crypto.createHash("sha256").update(JSON.stringify(enc)).digest("hex");
    console.log(profileHash);

    await ProfileModel.findOneAndUpdate(
      { address: checksummedAddress },
      { address: checksummedAddress, profile: enc, profileHash },
      { upsert: true, new: true }
    );

    let txHash = null;
    try {
      const tx = await identity().registerDID(profileHash);
      const receipt = await tx.wait();
      txHash = receipt?.hash;
    } catch (err: any) {
      console.error("Contract call failed:", err);
    }
    res.json({ ok: true, txHash, profileHash });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
