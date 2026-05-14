import { createCipheriv, randomBytes, scryptSync } from "node:crypto";

export function encryptSecret(input: { plaintext: string; secret: string }) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(input.secret, salt, 32);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(input.plaintext, "utf8"),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();

  return [
    "v1",
    salt.toString("base64url"),
    iv.toString("base64url"),
    authTag.toString("base64url"),
    ciphertext.toString("base64url")
  ].join(".");
}
