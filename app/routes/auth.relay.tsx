// app/routes/auth/send-otp.ts
import { pb } from "../atlas/db";
import { CryptoService, AuthService, SessionService } from "../atlas/services/server";
import type { ActionFunctionArgs } from "react-router";

// Shared headers for CORS and JSON responses
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

// Handles OTP generation and session check logic when no OTP is provided
async function handleOtpGeneration(
    cleanPhone: string,
    phoneHash: string,
    authCheck: { id: string; success: boolean; message: string; }
) {
    if (!authCheck.success)
        return Response.json(
            { success: authCheck.success, message: authCheck.message },
            { status: 401, headers: CORS_HEADERS }
        );

    // Check if user has a valid session
    const relationQuery = "auth_sessions_via_user";
    const existingSessionRecord = await pb.collection("users").getFirstListItem(
        `phone_hash="${phoneHash}"`,
        { expand: relationQuery }
    );
    if (existingSessionRecord?.expand?.[relationQuery]?.id) {
        const sessionId = existingSessionRecord.expand?.[relationQuery].session_id;
        return Response.json(
            {
                success: true,
                sessionId,
                message: 'Existing session found',
                systemMessage: 'Using existing session'
            },
            { headers: CORS_HEADERS }
        );
    }

    const otpResult = await AuthService.generateAndSendOTP(cleanPhone);

    return Response.json(otpResult, {
        status: otpResult.success ? 200 : 400,
        headers: CORS_HEADERS
    });
}

// Handles OTP verification logic when an OTP is provided
async function handleOtpVerification(
    cleanPhone: string,
    cleanOtp: string,
    userId: string
) {
    const { isValidOtp, message, success } = await AuthService.verifyOTP(cleanPhone, cleanOtp);
    if (isValidOtp && success) {
        const sessionId = await SessionService.createSession(userId);
        return Response.json(
            {
                success: true,
                sessionId,
                message: 'Authentication successful',
                systemMessage: message
            },
            { headers: CORS_HEADERS }
        );
    }
    console.error(`OTP verification failed for request: isValidOtp=${isValidOtp}, success=${success}, error="${message}"`);

    return Response.json(
        {
            success: false,
            message: 'Invalid OTP',
            systemMessage: message
        },
        { status: 401, headers: CORS_HEADERS }
    );
}

export async function action({ request }: ActionFunctionArgs) {
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
        return Response.json(
            { message: "Method not allowed" },
            { status: 405, headers: CORS_HEADERS }
        );
    }

    try {
        const body = await request.json();
        const rawPhone = body.phone as string;
        const rawOtp = body.otp as string | null;

        const phone = rawPhone?.replace(/[^0-9]/g, '');
        const otp = rawOtp?.replace(/[^0-9]/g, '');

        const phoneHash = CryptoService.hashPhoneNumber(phone);
        const authCheck = await AuthService.checkPhoneAuth(phoneHash);

        if (!otp) {
            return await handleOtpGeneration(phone, phoneHash, authCheck);
        } else {
            return await handleOtpVerification(phone, otp, authCheck.id);
        }
    } catch (error) {
        console.error('Internal server error:', error);
        return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}