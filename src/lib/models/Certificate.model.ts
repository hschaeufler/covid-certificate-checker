//Have a look at: https://de.test.dscg.ubirch.com/trustList/DSC/
export interface CertificateModel {
    certificateType?: string,
    country: string,
    kid: string,
    rawData: string,
    signature?: string,
    thumbprint?: string,
    timestamp?: string, // Bsp.: 2021-06-06T16:03:08+02:00
}