# Covid Certificate Checker Library
This Library is for parsing and verifying EU Electronic Health Certificates. Like the digital EU Covid Certificate.
## Why another Library
There are already some great Javascript-Libraries, who are helping to decode and verify a digital Covid-Certificate. 
But most of them targets a NodeJS Environment or make it necessary to use polyfills for NodeJS-Functions. 
Like the Buffer-Api or the NodeJS-Crpto-Module. The library is intended for web browsers and mobile first.
## How does it works?
Have a look at the official repository of the Euorpean eHealth network. 
There is a [overview](https://github.com/ehn-dcc-development/hcert-spec/blob/main/README.md) about the Design Principals. And also a [rudimentary Implementation-Example](https://github.com/ehn-dcc-development/ehn-sign-verify-javascript-trivial).
## Usage
You can easily use the Library as ES6 Module.

### Read Certificate
```
import ElectronicHealthCertificateChecker from "../dist";

const testCertificate = "HC1:....";
const healthCertificateClaim = ElectronicHealthCertificateChecker.decodeCertificate(testCertificate);
console.log(healthCertificateClaim);
```
Example:
```
{
  "iss": "DE",
  "iat": 1643356073,
  "exp": 1622316073,
  "hcert": {
    "v": [
      {
        "ci": "URN:UVCI:01DE/IZ12345A/5CWLU12RNOB9RXSEOP6FG8#W",
        "co": "DE",
        "dn": 1,
        "dt": "2021-05-29",
        "is": "Robert Koch-Institut",
        "ma": "ORG-100031184",
        "mp": "EU/1/20/1507",
        "sd": 2,
        "tg": "840539006",
        "vp": "1119349007"
      }
    ],
    "dob": "1964-08-12",
    "nam": {
      "fn": "Mustermann",
      "gn": "Erika",
      "fnt": "MUSTERMANN",
      "gnt": "ERIKA"
    },
    "ver": "1.0.0"
  }
}
```

### Verify Signature

You can verify the Signature by submitting a TrustList-Object in the format of https://de.test.dscg.ubirch.com/trustList/DSC/

```
const {
  healthCertificateClaim,
  isVerified
} = await ElectronicHealthCertificateChecker.verifyCertificate(testCertificate, undefined, trustList);
```

### Verify Signature
There are two ways two verify the signature. You can use a rawData-Public-Key, like in the German TrustList:
[Testumgebung Trustlist](https://de.test.dscg.ubirch.com/trustList/DSC/).
```
const {
  healthCertificateClaim,
  isVerified
} = await ElectronicHealthCertificateChecker.verifyCertificate(testCertificate, rawKey);
```
Or you can verify the Signature by submitting a TrustList-Object in the format of https://de.test.dscg.ubirch.com/trustList/DSC/
```
const {
  healthCertificateClaim,
  isVerified
} = await ElectronicHealthCertificateChecker.verifyCertificate(testCertificate, undefined, trustList);
```

