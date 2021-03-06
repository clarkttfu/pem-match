PEM Match
====

Regex to match PEM file headers according to [OpenSSL pem.h](https://github.com/openssl/openssl/blob/master/include/openssl/pem.h)

For each input pem string:
1. check if it contains PEM header line
2. check if it contains corresponding footer line
3. join the in-between lines and try decoding it as base64
4. return the matched `label`, i.e. `RSA PRIVATE KEY` and `type`, i.e. `PRIVATE`.

## API

### PEM.matchKey(pem)

Match and return `{ label, type }` or `undefined`:
- Property `label` could be : 
  - `PRIVATE KEY`
  - `RSA PRIVATE KEY`
  - `ANY PRIVATE KEY`
  - `ENCRYPTED PRIVATE KEY`
  - `PUBLIC KEY`
  - ...
- Property `type`:
  - `PRIVATE`
  - `PUBLIC`

### PEM.matchX509(pem)

Match and return `{ label, type }` or `undefined`:
- Property `label` could be:
  - `CERTIFICATE`
  - `TRUSTED CERTIFICATE`
  - `CERTIFICATE REQUEST`
  - `NEW CERTIFICATE REQUEST`
  - `X509 CRL`
- Property `type`:
  - `CERTIFICATE`
  - `REQUEST`
  - `CRL`

### PEM.matchKeyBegin(pem: string)

Match only begin header and return `{ label, type }` or `undefined`

### PEM.matchKeyEnd(pem: string)

Match only end footer and return `{ label, type }` or `undefined`

### PEM.matchX509Begin(pem: string)

Match only begin header and return `{ label }` or `undefined`

### PEM.matchX509End(pem: string)

Match only end footer and return `{ label }` or `undefined`

### PEM.isPrivateKey(pem)

Match and return the private key label or `undefined`.

### PEM.isPublicKey(pem)

Match and return the private key label or `undefined`.

### PEM.isX509Cert(pem)

Match and return the certificate label or `undefined`.

### PEM.isX509Request(pem)

Match and return the certificate request label or `undefined`.

### PEM.isX509CRL(pem)

Match and return the CRL label or `undefined`.