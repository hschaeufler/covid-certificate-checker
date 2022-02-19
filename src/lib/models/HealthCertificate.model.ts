/* More about the Schemas for HeatlhCertificate:
 * https://github.com/ehn-dcc-development/ehn-dcc-schema/blob/release/1.3.0/DCC.combined-schema.json
 * https://github.com/ehn-dcc-development/ehn-dcc-schema/wiki/FAQ
 * https://ec.europa.eu/health/system/files/2021-04/digital-green-certificates_dt-specifications_en_0.pdf
 */

export interface HealthCertificateModel {
    ver: string, //Schema Version
    nam: PersonName, //Sur and Forename
    dob: string, //Date of Birth in ISO 8601
    v?: VaccinationEntry[], //only one Element - one of v,t,r must be set
    t?: TestEntry[], //only one Element - one of v,t,r must be set
    r?: RecoveryEntry[], //only one Element - one of v,t,r must be set
}

export interface PersonName {
    fn?: string, //surname
    fnt: string, //Standardised surname
    gn?: string, //Forename
    gnt?: string, //Standardised forename
}

export interface VaccinationEntry {
    tg: string, //"disease or agent targeted",
    vp: string, //"vaccine or prophylaxis"
    mp: string, //"vaccine medicinal product"
    ma: string, //manufacturer
    dn: number, //"Dose Number"
    sd: number, //"Total Series of Doses"
    dt: string, //"ISO8601 complete date: Date of Vaccination"
    co: string, //"Country of Vaccination"
    is: number, //"Certificate Issuer"
    //https://ec.europa.eu/health/sites/health/files/ehealth/docs/vaccination-proof_interoperability-guidelines_en.pdf
    ci: string, //"Unique Certificate Identifier: UVCI"
}

export interface TestEntry {
    tg: string, // "disease or agent targeted",
    tt: string, // "Type of Test"
    nm?: string,// "NAA Test Name"
    ma?: string,// "RAT Test name and manufacturer",
    sc: string, // "Date/Time of Sample Collection",
    tr: string, // "Test Result"
    tc: string, // "Testing Center"
    co: string, // "Country of Test",
    is: number, // "Certificate Issuer"
    ci: string, // "Unique Certificate Identifier: UVCI"
}

export interface RecoveryEntry {
    tg: string, // "disease or agent targeted",
    fr: string, // "ISO 8601 complete date of first positive NAA test result"
    co: string, // "Country of Test",
    is: number, // "Certificate Issuer"
    df: string, // "ISO 8601 complete date: Certificate Valid From"
    du: string,// "ISO 8601 complete date: Certificate Valid Until"
    ci: string,// "Unique Certificate Identifier, UVCI"
}