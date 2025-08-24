import { Router } from "express";
import { registerHandler } from "../services/register";
import { issueCredentialHandler } from "../services/credential";
import { requestAccessHandler, consentHandler } from "../services/access";
import { verifyCredentialHandler } from "../services/verify";

export const apiRouter = Router();

apiRouter.post("/register", registerHandler);
apiRouter.post("/issueCredential", issueCredentialHandler);
apiRouter.post("/requestAccess", requestAccessHandler);
apiRouter.post("/consent", consentHandler);
apiRouter.post("/verifyCredential", verifyCredentialHandler);
