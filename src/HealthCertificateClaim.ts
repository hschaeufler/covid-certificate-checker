/*
 * CBOR Web Token Claims
 * See: https://www.iana.org/assignments/cwt/cwt.xhtml#European_eHealth_Network
 */
import {HealthCertificateModel} from "./HealthCertificate.model";

export interface HealthCertificateClaim {
    iss: string, // Issuer - Claim Key 1
    exp: string, // Expiration Time - Claim Key 4 - integer or floating-point number
    iat: string, // Issued At - Claim Key 6 - integer or floating-point number
    hcert: HealthCertificateModel, // European Health Certificate - Claim Key -260
}