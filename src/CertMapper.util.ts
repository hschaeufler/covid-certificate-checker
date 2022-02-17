import {HealthCertificateClaim} from "./models/HealthCertificateClaim";
import {HealthCertificateModel} from "./models/HealthCertificate.model";

export class CertMapperUtil {
    static payloadToHCERTClaim(payload: Map<any, any>): HealthCertificateClaim {
        if (!payload) {
            throw new DOMException("Cert-Payload is empty!");
        }
        return {
            iss: payload.get(1),
            iat: payload.get(4),
            exp: payload.get(6),
            hcert: CertMapperUtil.payloadToHCERT(payload.get(-260)),
        } as HealthCertificateClaim;
    }

    static payloadToHCERT(payload: Map<any, any>): HealthCertificateModel {
        if (!payload || !payload.has(1)) {
            throw new DOMException("Cert-Payload is empty!");
        }
        const healthCert = payload.get(1);
        return {
           ...healthCert
        } as HealthCertificateModel;
    }
}