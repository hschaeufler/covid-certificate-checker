import {HealthCertificateClaim} from "./HealthCertificateClaim";

export function toBase64String(uint8Array: Uint8Array) {
    let charString = "";
    for (let i = 0; i < uint8Array.byteLength; i++) {
        charString = charString + String.fromCharCode(uint8Array[i]);
    }
    const base64String = btoa(charString);
    return base64String;
}

