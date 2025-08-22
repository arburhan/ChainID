import { Router } from "express";
import { registerHandler } from "../services/register.ts";
import { issueCredentialHandler } from "../services/credential.ts";
import { requestAccessHandler, consentHandler } from "../services/access.ts";
import { verifyCredentialHandler } from "../services/verify.ts";

export const apiRouter = Router();

apiRouter.post("/register", registerHandler);
apiRouter.post("/issueCredential", issueCredentialHandler);
apiRouter.post("/requestAccess", requestAccessHandler);
apiRouter.post("/consent", consentHandler);
apiRouter.post("/verifyCredential", verifyCredentialHandler);
