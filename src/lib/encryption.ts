import { BaseService } from "@/services/base.service";

interface EncryptedNinResponse {
  encrypted_nin: string; // Base64 encrypted NIN (RSA)
}

export class EncryptionService extends BaseService {
  private static readonly BASE_PATH = "/api/public/nin";

  /**
   * Fetch the RSA public key for NIN encryption
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
   * Encrypt NIN using RSA public key
   * Returns only the encrypted data (RSA doesn't use IV/tag)
   */
  static async encryptNin(
    publicKey: string,
    nin: string,
  ): Promise<EncryptedNinResponse> {
    try {
      const publicKeyPem = publicKey;

      // Clean and prepare the PEM public key
      const pemBody = publicKeyPem
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

      // Encrypt the NIN
      const encoded = new TextEncoder().encode(nin);
      const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        cryptoKey,
        encoded,
      );

      // Convert to base64
      const encryptedBase64 = btoa(
        String.fromCharCode(...new Uint8Array(encrypted)),
      );

      return {
        encrypted_nin: encryptedBase64,
      };
    } catch (error) {
      console.error("NIN encryption failed:", error);
      throw new Error("Failed to encrypt NIN");
    }
  }

  /**
   * For BVN encryption when implemented
   */
  static async encryptBvn(bvn: string): Promise<{
    bvn_iv: string;
    bvn_data: string;
    bvn_tag: string;
  }> {
    // Similar implementation for BVN
    // Will use the same or different public key endpoint
    throw new Error("BVN encryption not implemented yet");
  }
}
