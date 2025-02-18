import { createHash, createCipheriv, createDecipheriv } from "node:crypto";

export class CryptoService {
    private static readonly SALT_ALGORITHM = "sha256";
    private static readonly ENCRYPTION_ALGORITHM = "aes-256-cbc";
    private static readonly ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'base64');
    private static readonly ENCRYPTION_IV = Buffer.from(process.env.ENCRYPTION_IV!, 'base64');


    static hashPhoneNumber(phoneNumber: string): string {
        return createHash(this.SALT_ALGORITHM)
            .update(phoneNumber.trim())
            .digest("hex");
    }

    static encrypt(text: string): string {
        const cipher = createCipheriv(this.ENCRYPTION_ALGORITHM, this.ENCRYPTION_KEY, this.ENCRYPTION_IV);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }

    static decrypt(encryptedText: string): string {
        const decipher = createDecipheriv(this.ENCRYPTION_ALGORITHM, this.ENCRYPTION_KEY, this.ENCRYPTION_IV);
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
}

