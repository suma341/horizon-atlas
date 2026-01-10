import { createDecipheriv } from "crypto";
import { gunzipSync } from "zlib";

export async function loadAndDecodeJson<T>(encoded: string): Promise<T> {
  const cipherBytes = Buffer.from(encoded.toString(), "base64");
  const key = Buffer.from(process.env.ENC_KEY ?? "", "utf8");
  if (key.length !== 32) {
    throw new Error("ENC_KEY must be 32 bytes");
  }

  const decrypted = decryptAESGCM(cipherBytes, key);
  const jsonBytes = gunzipSync(decrypted);
  return JSON.parse(jsonBytes.toString("utf8")) as T;
}
function decryptAESGCM(ciphertext: Buffer, key: Buffer): Buffer {
  if (key.length !== 32) {
    throw new Error("key must be 32 bytes (AES-256)");
  }

  const nonceSize = 12;
  if (ciphertext.length < nonceSize) {
    throw new Error("ciphertext too short");
  }

  const nonce = ciphertext.subarray(0, nonceSize);
  const encrypted = ciphertext.subarray(nonceSize);

  const authTag = encrypted.subarray(encrypted.length - 16);
  const data = encrypted.subarray(0, encrypted.length - 16);

  const decipher = createDecipheriv("aes-256-gcm", key, nonce);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(data),
    decipher.final(),
  ]);
}
