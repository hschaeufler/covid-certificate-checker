import * as b45 from "base45-ts";
import * as pako from 'pako';
import * as cbor from 'cbor-web';
import * as x509 from "@peculiar/x509";
import {toBase64String} from "./utils";
import {CertMapperUtil} from "./CertMapper.util";
import {HealthCertificateClaim} from "./models/HealthCertificateClaim";
import {TrustListModel} from "./models/TrustList.model";
import {CertificateModel} from "./models/Certificate.model";
import { CoseMessageModel } from "./models/CoseMessage.model";

//See: https://github.com/ehn-dcc-development/ehn-sign-verify-javascript-trivial/blob/main/cose_verify.js
export class ElectronicHealthCertificateChecker {

    static async verifyCertificate(
        certificate: string,
        publicKey?: string,
        trustList?: TrustListModel,
    ): Promise<{
        healthCertificateClaim: HealthCertificateClaim,
        isVerified: boolean,
    }>
    {
        if(!trustList && !publicKey){
            throw new DOMException("Please submit either a Public-Key or a Trust-List for verifying!");
        }
        const decodedCertificate = this.decodeCBOR(this.inflateZlib(this.decodeBase45(this.removeHC1Header(certificate))));

        let filteredCertificates: CertificateModel[] = [];
        if(trustList && trustList.certificates) {
            filteredCertificates = trustList.certificates.filter(
                certificate => certificate.kid == decodedCertificate.kid
            );

            if(filteredCertificates.length < 1) {
                throw new DOMException("No Certificate in Trust-List with specified kid: "+ decodedCertificate.kid);
            }
        }

        const key = filteredCertificates.length > 0 ? filteredCertificates[0].rawData : publicKey;

        if(!key){
            throw new DOMException("No Key was specified");
        }

        const isVerified = await this.verifyCoseMessage(decodedCertificate.coseMessage,key);
        return {
            healthCertificateClaim: decodedCertificate.hcertCertClaim,
            isVerified
        };
    }

    private static decodeCertificate(certificate: string): HealthCertificateClaim {
        const decodedCertificate = this.decodeCBOR(this.inflateZlib(this.decodeBase45(this.removeHC1Header(certificate))));
        return decodedCertificate.hcertCertClaim;
    }

    private static removeHC1Header(certificate: string): string {
        if (certificate.startsWith("HC1:")) {
            return certificate.substring(4);
        }
        console.warn("No HC1:-Prefix");
        return certificate;
    }

    private static decodeBase45(encodedMessage: string): Uint8Array {
        return b45.decode(encodedMessage);
    }

    private static inflateZlib(compressedString: Uint8Array): Uint8Array {
        return pako.inflate(compressedString)
    }

    private static decodeCBOR(cborByteArray: Uint8Array): {
        coseMessage: CoseMessageModel,
        hcertCertClaim: HealthCertificateClaim,
        kid: string
    } {
        const data = cbor.decode(cborByteArray);
        const [protectHeader, unprotectHeader, payload, sig] = data.value;

        const coseMessage = {
            protectHeader,
            unprotectHeader,
            payload,
            sig,
        } as CoseMessageModel;

        const decodedHeaders = cbor.decode(protectHeader);

        let kidUintArray;
        if(decodedHeaders && decodedHeaders.has(4)) {
            kidUintArray = decodedHeaders.get(4);
        } else if (unprotectHeader && unprotectHeader.has(4)) {
            kidUintArray = unprotectHeader.get(4);
        }

        const kid = toBase64String(kidUintArray);

        const decodedPaylod = cbor.decode(payload);

        const hcertCertClaim = CertMapperUtil.payloadToHCERTClaim(decodedPaylod);

        return {coseMessage, hcertCertClaim, kid};
    }


    static async verifyCoseMessage (
        coseMessage: CoseMessageModel,
        publicKey: string
    ): Promise<boolean> {

        const cert = new x509.X509Certificate(publicKey);
        const rawData = cert.publicKey.rawData;

        //See: https://github.com/btielen/covid-certificate/blob/7f8631a2e0bdc5debf5c9877858d71ffd8ade329/src/cose/ECDS256SignatureVerifier.ts#L6
        const pk = await crypto.subtle.importKey(
            "spki",
            rawData,
            { name: "ECDSA", namedCurve: "P-256" },
            false,
            ["verify"]
        )

        const verified = await crypto.subtle.verify(
            { name: "ECDSA", hash: "sha-256" },
            pk,
            coseMessage.sig,
            cbor.encode(["Signature1", coseMessage.protectHeader, (new Uint8Array(0)).buffer, coseMessage.payload])
        );

        return verified;
    }

}