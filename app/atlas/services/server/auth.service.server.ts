import { pb } from "../../db";
import { CryptoService } from './crypto.service.server';
import { createCookie, redirect } from "react-router";
import type { VerifyOTPResponse, CheckPhoneAuthResponse, GenerateAndSendOTPResponse } from '../../types';

/** A list of paths that don't require authentication */
const PUBLIC_PATHS = ['/auth'];

export class AuthService {
    static async checkPhoneAuth(phoneHash: string): Promise<CheckPhoneAuthResponse> {
        try {
            const records = await pb.collection("users").getFirstListItem(`phone_hash="${phoneHash}"`, {
                fields: "id",
            });

            if (records.id.length < 1) {
                return {
                    id: "",
                    success: false,
                    message: "No user found",
                };
            }

            return {
                id: records.id,
                success: true,
                message: "Phone authorized",
            };
        } catch (error) {
            console.error("Database query error:", error);
            return {
                id: "",
                success: false,
                message: "Database query error",
            };
        }
    }

    static async createSession(phoneHash: string): Promise<string> {
        const sessionId = crypto.randomUUID();
        await pb.collection("sessions").create({
            session_id: sessionId,
            phone_hash: phoneHash,
            expires_at: new Date(Date.now() + 604800000), // 1 week
        });
        return sessionId;
    }

    static async generateAndSendOTP(phone: string): Promise<GenerateAndSendOTPResponse> {
        try {
            const response = await fetch("https://textbelt.com/otp/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    phone,
                    userid: CryptoService.hashPhoneNumber(phone), // Use hashed phone as userid
                    message: "Your Private Relay verification code: $OTP",
                    lifetime: "300", // 5 minutes
                    length: "6",
                    key: process.env.TEXTBELT_API_KEY!,
                }),
            });

            const data = await response.json() as {
                success: boolean;
                error: string;
            };

            return {
                success: data.success,
                message: data.success ? "OTP sent successfully" : data.error,
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to send OTP",
            };
        }
    }

    static async verifyOTP(phone: string, otp: string): Promise<VerifyOTPResponse> {
        const failureResponse: VerifyOTPResponse = {
            success: false,
            isValidOtp: false,
            message: "Failed to verify OTP",
        };

        try {
            const queryParams = new URLSearchParams({
                otp,
                userid: CryptoService.hashPhoneNumber(phone), // Use hashed phone as userid
                key: process.env.TEXTBELT_API_KEY!,
            });

            const response = await fetch(
                `https://textbelt.com/otp/verify?${queryParams}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            const data = await response.json() as VerifyOTPResponse;

            if (!data.success) return failureResponse;

            return {
                ...data,
                message: "[INFO]: OTP verified successfully",
            };
        } catch (error) {
            console.error("Textbelt OTP verification error:", error);
            return failureResponse;
        }
    }
}


export class SessionService {
    private static readonly SESSION_COOKIE_NAME = 'atlas_session';
    public static SESSION_COOKIE = createCookie(this.SESSION_COOKIE_NAME, {
        maxAge: 604800, // 1 week
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    });

    static async createSession(userId: string): Promise<string> {
        const sessionId = crypto.randomUUID();

        await pb.collection('auth_sessions').create({
            user: userId, // Using the actual user record ID
            session_id: sessionId,
            expires_at: new Date(Date.now() + 604800000), // 1 week
            last_activity: new Date(),
        });

        return sessionId;
    }

    static async validateSession(sessionId: string): Promise<boolean> {
        try {
            const record = await pb.collection('auth_sessions').getFirstListItem(`session_id="${sessionId}"`);

            if (!record) return false;

            const expiresAt = new Date(record.expires_at);
            if (expiresAt < new Date()) {
                // Session expired, clean it up
                await pb.collection('auth_sessions').delete(record.id);
                return false;
            }

            // Update last activity
            await pb.collection('auth_sessions').update(record.id, {
                last_activity: new Date()
            });

            return true;
        } catch {
            return false;
        }
    }

    static async requireAuth(request: Request) {
        const url = new URL(request.url);
        const cookieHeader = request.headers.get('Cookie');
        const session = await this.SESSION_COOKIE.parse(cookieHeader);
        const isPublicPath = PUBLIC_PATHS.some(path => url.pathname.startsWith(path));

        if (!session) {
            if (!isPublicPath) throw redirect('/auth');
            return null;
        }

        const isValid = await this.validateSession(session);
        if (!isValid && !isPublicPath) {
            throw redirect('/auth');
        }

        return isValid ? session : null;
    }

    static getIsAuthenticated(session: string | null): boolean {
        return Boolean(session);
    }
}