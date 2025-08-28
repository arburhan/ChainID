import { Router } from "express";
import { registerHandler } from "../services/register";
import { issueCredentialHandler } from "../services/credential";
import { requestAccessHandler, consentHandler } from "../services/access";
import { verifyCredentialHandler, verifyProfileHashHandler } from "../services/verify";
import { AuditModel } from "../models/Audit";

export const apiRouter = Router();

apiRouter.post("/register", registerHandler);
apiRouter.post("/issueCredential", issueCredentialHandler);
apiRouter.post("/requestAccess", requestAccessHandler);
apiRouter.post("/consent", consentHandler);
apiRouter.post("/verifyCredential", verifyCredentialHandler);
apiRouter.post("/verifyProfileHash", verifyProfileHashHandler);

// Audit routes
apiRouter.get("/audit/recent", async (req, res) => {
  try {
    const limit = Math.min(parseInt((req.query.limit as string) || "50", 10), 200);
    const items = await AuditModel.find({}).sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ ok: true, items });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

apiRouter.get("/audit/by-address/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const items = await AuditModel.find({ $or: [{ actor: address }, { subject: address }] }).sort({ createdAt: -1 }).limit(200).lean();
    res.json({ ok: true, items });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
