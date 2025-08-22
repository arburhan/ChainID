import crypto from "crypto";

function getKey(): Buffer {
  const hex = process.env.AES_SECRET_HEX || "";
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error("AES_SECRET_HEX must be 32-byte hex");
  return Buffer.from(hex, "hex");
}

export function encryptJson(data: unknown): { iv: string; tag: string; ciphertext: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(data));
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), ciphertext: ciphertext.toString("hex") };
}

export function decryptJson(payload: { iv: string; tag: string; ciphertext: string }): unknown {
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(payload.iv, "hex"));
  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, "hex")), decipher.final()]);
  return JSON.parse(decrypted.toString("utf-8"));
}
