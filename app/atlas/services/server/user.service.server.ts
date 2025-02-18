import { pb } from "../../db";
import { CryptoService } from "./crypto.service.server";

export class UserService {
    static async findByPhone(phoneNumber: string) {
        const hashedPhone = CryptoService.hashPhoneNumber(phoneNumber);
        const users = await pb.collection('users').getFullList<{ name: string, phone: string; }>();
        return users.find(user => user.phone === hashedPhone);
    }

    static findByName(users: { name_hash: string, phone_hash: string; }[], name: string) {
        return users.find(user => {
            try {
                return CryptoService.decrypt(user.name_hash).toLowerCase() === name.toLowerCase();
            } catch {
                return false;
            }
        });
    }

    static formatUser(user: { name: string, phone: string; }) {
        return {
            hashedPhone: user.phone,
            encryptedName: user.name,
            decryptedName: CryptoService.decrypt(user.name)
        };
    }
}