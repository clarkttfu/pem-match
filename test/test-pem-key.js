const test = require('tape')
const PEM = require('../index.js')

const beginHeaders = [
  // PKCS#1
  '-----BEGIN RSA PRIVATE KEY-----',
  '-----BEGIN RSA PUBLIC KEY-----',
  // PKCS#8
  '-----BEGIN PRIVATE KEY-----',
  '-----BEGIN ENCRYPTED PRIVATE KEY-----',
  '-----BEGIN PUBLIC KEY-----',
  // DSA
  '-----BEGIN DSA PRIVATE KEY-----',
  '-----BEGIN DSA PUBLIC KEY-----',
  // SSH2
  '---- BEGIN SSH2 PUBLIC KEY ----'
]

const endHeaders = [
  // PKCS#1
  '-----END RSA PRIVATE KEY-----',
  '-----END RSA PUBLIC KEY-----',
  // PKCS#8
  '-----END PRIVATE KEY-----',
  '-----END ENCRYPTED PRIVATE KEY-----',
  '-----END PUBLIC KEY-----',
  // DSA
  '-----END DSA PRIVATE KEY-----',
  '-----END DSA PUBLIC KEY-----',
  // SSH2
  '---- END SSH2 PUBLIC KEY ----'
]

test('Test PEM key begin headers', t => {
  for (const h of beginHeaders) {
    const match = PEM.matchKeyBegin(h)
    t.ok(match, `matchKeyBegin ${h}`)
    const line = h.replace(/-/g, '').trim()
    t.ok(line.endsWith(match.label), `matchKeyBegin label ${match.label}`)
    t.ok(line.includes(match.type), `matchKeyBegin type ${match.type}`)
  }
  t.end()
})

test('Test PEM key end headers', t => {
  for (const h of endHeaders) {
    const match = PEM.matchKeyEnd(h)
    t.ok(match, `matchKeyEnd ${h}`)
    const line = h.replace(/-/g, '').trim()
    t.ok(line.endsWith(match.label), `matchKeyEnd label ${match.label}`)
    t.ok(line.includes(match.type), `matchKeyBegin type ${match.type}`)
  }
  t.end()
})

test('Test PEM matchKey', t => {
  const eols = ['\r', '\r\n', '\n']
  for (let i = 0; i < beginHeaders.length; i++) {
    const eol = eols[i % eols.length]

    const pem = `${beginHeaders[i]}${eol}AQ==${eol}${endHeaders[i]}`
    const pem2 = `${beginHeaders[i]}AQ==${endHeaders[i]}`

    t.ok(PEM.matchKey(pem), `matchKey with eol ${pem}`)
    t.ok(PEM.matchKey(pem2), `matchKey without eol ${pem}`)

    const fake1 = `${beginHeaders[i]}${eol}${eol}${endHeaders[i]}`
    const fake2 = `${beginHeaders[i]}${eol}AQ==`
    const fake3 = `AQ==${eol}${endHeaders[i]}`

    t.notOk(PEM.matchKey(fake1), `matchKey with eol ${fake1}`)
    t.notOk(PEM.matchKey(fake2), `matchKey with eol ${fake2}`)
    t.notOk(PEM.matchKey(fake3), `matchKey with eol ${fake3}`)
  }
  t.end()
})
