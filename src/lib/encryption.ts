// lib/encryption.ts
import { BaseService } from "@/services/base.service";

export interface EncryptedData {
  encrypted_nin?: string;
  encrypted_bvn?: string;
}

export class EncryptionService extends BaseService {
  private static readonly BASE_PATH = "/api/public/nin";

  /**
   * Fetch the RSA public key for encryption
   */
  static async getPublicKey(): Promise<string> {
    try {
      const response = await this.get<{ success: boolean; public_key: string }>(
        `${this.BASE_PATH}/public-key`,
      );

      if (!response.success || !response.data?.public_key) {
        throw new Error("Failed to fetch public key");
      }

      return response.data.public_key;
    } catch (error) {
      console.error("Failed to fetch public key:", error);
      throw new Error("Could not retrieve encryption key");
    }
  }

  /**
   * Generic encryption method for both NIN and BVN
   * @param type - "nin" or "bvn"
   * @param publicKey - RSA public key
   * @param value - The value to encrypt (NIN or BVN)
   * @returns Object with encrypted_${type} key
   */
  static async encrypt(
    type: "nin" | "bvn",
    publicKey: string,
    value: string,
  ): Promise<EncryptedData> {
    try {
      // Clean and prepare the PEM public key
      const pemBody = publicKey
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\n/g, "")
        .trim();

      // Convert base64 to binary
      const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

      // Import the RSA public key
      const cryptoKey = await crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-1", // Match PHP backend
        },
        false,
        ["encrypt"],
      );

      // Encrypt the value
      const encoded = new TextEncoder().encode(value);
      const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        cryptoKey,
        encoded,
      );

      // Convert to base64
      const encryptedBase64 = btoa(
        String.fromCharCode(...new Uint8Array(encrypted)),
      );

      // Return the appropriate key based on type
      const returnKey = type === "nin" ? "encrypted_nin" : "encrypted_bvn";

      return {
        [returnKey]: encryptedBase64,
      } as EncryptedData;
    } catch (error) {
      console.error(`${type.toUpperCase()} encryption failed:`, error);
      throw new Error(`Failed to encrypt ${type.toUpperCase()}`);
    }
  }

  /**
   * Convenience method for NIN encryption
   */
  static async encryptNin(
    publicKey: string,
    nin: string,
  ): Promise<{ encrypted_nin: string }> {
    const result = await this.encrypt("nin", publicKey, nin);
    return { encrypted_nin: result.encrypted_nin! };
  }

  /**
   * Convenience method for BVN encryption
   */
  static async encryptBvn(
    publicKey: string,
    bvn: string,
  ): Promise<{ encrypted_bvn: string }> {
    const result = await this.encrypt("bvn", publicKey, bvn);
    return { encrypted_bvn: result.encrypted_bvn! };
  }
}
