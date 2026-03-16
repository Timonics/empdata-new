import { BaseService } from "@/services/base.service";

interface EncryptedNinResponse {
  nin_number_iv: string; // Empty string for RSA
  nin_number_data: string; // Base64 encrypted NIN
  nin_number_tag: string; // Empty string for RSA
}

export class EncryptionService extends BaseService {
  private static readonly BASE_PATH = "/portal/nin";

  /**
   * Fetch the RSA public key for NIN encryption
   * Uses the authenticated api instance from BaseService
   */
  static async getPublicKey(): Promise<string> {
    try {
      // This will automatically include the auth token via axios interceptor
      const response = await this.get<{ public_key: string }>(
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
   */
  static async encryptNin(nin: string): Promise<EncryptedNinResponse> {
    try {
      // Get public key - token automatically included via BaseService
      const publicKeyPem = await this.getPublicKey();

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
          hash: "SHA-1", // Match your PHP backend
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

      // Return in the format expected by the API
      return {
        nin_number_iv: "", // Empty string for RSA
        nin_number_data: encryptedBase64,
        nin_number_tag: "", // Empty string for RSA
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
