PEM Match
====

Regex to match PEM file headers according to [OpenSSL pem.h definitions](https://github.com/openssl/openssl/blob/master/include/openssl/pem.h)

For each input pem string:
1. check if it contains PEM header line
2. check if it contains corresponding footer line
3. join the in-between lines and try decoding it as base64
4. return the matched header label, i.e. `RSA PRIVATE KEY`

## API

### PEM.matchKey(pem)

Match and return `{ label, type }` or `undefined`:
- `label` could be : 
  - `PRIVATE KEY`
  - `RSA PRIVATE KEY`
  - `ANY PRIVATE KEY`
  - `ENCRYPTED PRIVATE KEY`
  - `PUBLIC KEY`
  - ...
- `type`:
  - `PRIVATE`
  - `PUBLIC`

### PEM.matchX509(pem)

Match and return `{ label }` or `undefined`:
And `label` could be:
- `CERTIFICATE`
- `TRUSTED CERTIFICATE`
- `CERTIFICATE REQUEST`
- `NEW CERTIFICATE REQUEST`
- `X509 CRL`

### PEM.isPrivateKey(pem)

Match and return the private key label or `undefined`.

### PEM.isPublicKey(pem)

Match and return the private key label or `undefined`.

### PEM.matchKeyBegin(pem: string)

Match only begin header and return `{ label, type }` or `undefined`

### PEM.matchKeyEnd(pem: string)

Match only end footer and return `{ label, type }` or `undefined`

### PEM.matchX509Begin(pem: string)

Match only begin header and return `{ label }` or `undefined`

### PEM.matchX509End(pem: string)

Match only end footer and return `{ label }` or `undefined`