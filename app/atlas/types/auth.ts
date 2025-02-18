export interface CheckPhoneAuthResponse {
    id: string;
    success: boolean;
    message: string;
}

export interface AuthRequestPayload {
    phone: string;
    otp: string;
}

export interface VerifyOTPResponse {
    success: boolean;
    isValidOtp: boolean;
    message: string;
}

export interface GenerateAndSendOTPResponse {
    success: boolean;
    message: string;
}

export interface ActionData {
    success?: boolean;
    message?: string;
    sessionId?: string;
}