import type { Request, Response } from "express";
import { accessCtrl } from "./eth.ts";
import { ConsentModel } from "../models/Consent.ts";
import { ethers } from "ethers";
import crypto from "crypto";

export async function requestAccessHandler(req: Request, res: Response) {
  try {
    const { requester, subject, purpose } = req.body as { requester: string; subject: string; purpose: Record<string, unknown> };
    if (!requester || !subject || !purpose) return res.status(400).json({ error: "Missing fields" });
    
    // Validate and checksum the addresses
    let checksummedRequester: string;
    let checksummedSubject: string;
    try {
      checksummedRequester = ethers.getAddress(requester);
      checksummedSubject = ethers.getAddress(subject);
    } catch (error) {
      return res.status(400).json({ error: "Invalid Ethereum address format" });
    }
    
    const purposeHash = "0x" + crypto.createHash("sha256").update(JSON.stringify(purpose)).digest("hex");
    const tx = await accessCtrl.requestAccess(checksummedSubject, purposeHash);
    const rc = await tx.wait();
    await ConsentModel.create({
      requestId: "",
      requester: checksummedRequester,
      subject: checksummedSubject,
      purposeHash,
      approved: false
    });
    res.json({ ok: true, txHash: rc?.hash, purposeHash });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function consentHandler(req: Request, res: Response) {
  try {
    const { requestId, subject, signature, optionalProof } = req.body as { requestId: string; subject: string; signature: string; optionalProof?: string };
    if (!requestId || !subject || !signature) return res.status(400).json({ error: "Missing fields" });
    const reqIdBytes32 = requestId as `0x${string}`;

    const proofBytes = optionalProof ? ethers.getBytes(optionalProof) : new Uint8Array();
    const tx = await accessCtrl.approve(reqIdBytes32, signature, proofBytes);
    const receipt = await tx.wait();

    await ConsentModel.updateOne({ requestId }, { approved: true, signature });
    res.json({ ok: true, txHash: receipt?.hash });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
