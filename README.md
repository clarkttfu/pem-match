PEM Match
====

Regex to match PEM file headers according to [OpenSSL pem.h definitions](https://github.com/openssl/openssl/blob/master/include/openssl/pem.h)

For each input pem string:
1. check if it contains PEM header line
2. check if it contains corresponding footer line
3. join the in-between lines and try decoding it as base64
4. return the matched header label, i.e. `RSA PRIVATE KEY`

## API

### PEM.isPrivateKey(pem)

Match and return below labels or `undefined`:
- `PRIVATE KEY`
- `RSA PRIVATE KEY`
- `DSA PRIVATE KEY`
- `ANY PRIVATE KEY`
- `EC PRIVATE KEY`
- `ENCRYPTED PRIVATE KEY`

### PEM.isPublicKey(pem)

Match and return below labels or `undefined`:
- `PUBLIC KEY`
- `RSA PUBLIC KEY`
- `DSA PUBLIC KEY`
- `SSH2 PUBLIC KEY`

### PEM.isKey(pem)

Match and return either private or public key.

### PEM.isX509Cert(pem)

Match and return below labels or `undefined`:
- `X509 CERTIFICATE`
- `CERTIFICATE`
- `TRUSTED CERTIFICATE`

### PEM.isX509Request(pem)

Match and return below labels or `undefined`:
- `NEW CERTIFICATE REQUEST`
- `CERTIFICATE REQUEST`

### PEM.isX509CRL(pem)

Match and return below labels or `undefined`:
- `X509 CRL`

## More API

### PEM.beginWithPrivateKey(pem)
Check if pem begins with a private key label then return it.
### PEM.endWithPrivateKey(pem)
Check if pem ends with a private key label then return it.

### PEM.beginWithPublicKey(pem)
Check if pem begins with a public key label then return it.
### PEM.endWithPublicKey(pem)
Check if pem ends with a public key label then return it.

### PEM.beginWithX509Cert(pem)
Check if pem begins with a x509 certificate label then return it.
### PEM.endWithX509Cert(pem)
Check if pem ends with a x509 certificate label then return it.

### PEM.beginWithX509Request(pem)
Check if pem begins with a x509 certificate request label then return it.
### PEM.endWithX509Request(pem)
Check if pem ends with a x509 certificate request label then return it.

### PEM.beginWithX509CRL(pem)
Check if pem begins with a x509 CRL label then return it.
### PEM.endWithX509CRL(pem)
Check if pem ends with a x509 CRL label then return it.
