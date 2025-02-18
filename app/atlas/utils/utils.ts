import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPhoneNumber(input: string) {
    const phoneNumber = parsePhoneNumberFromString(input, 'US');

    if (!phoneNumber) {
        console.error(`Error parsing phone number: ${input}`);
        return null;
    }

    return `${phoneNumber.countryCallingCode}${phoneNumber.nationalNumber}`;
}
// Function to validate E.164 format
export function isValidE164(number: string) {
    const e164Regex = /^1\d{10}$/;
    return e164Regex.test(number);
}

export function removeEscapeCodes(str: string) {
    return str.replace(/(\r\n|\n|\r)/g, '');
}

export function parseError(error: Record<string, any>) {
    return JSON.parse(JSON.stringify(error, null, 2));
}