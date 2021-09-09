const test = require('tape')
const PEM = require('../index.js')

const beginPrivHeaders = [
  '-----BEGIN RSA PRIVATE KEY-----',
  '-----BEGIN PRIVATE KEY-----',
  '-----BEGIN ENCRYPTED PRIVATE KEY-----',
  '-----BEGIN DSA PRIVATE KEY-----'
]

const endPrivHeaders = [
  '-----END RSA PRIVATE KEY-----',
  '-----END PRIVATE KEY-----',
  '-----END ENCRYPTED PRIVATE KEY-----',
  '-----END DSA PRIVATE KEY-----'
]

const beginPubHeaders = [
  '-----BEGIN RSA PUBLIC KEY-----',
  '-----BEGIN PUBLIC KEY-----',
  '-----BEGIN DSA PUBLIC KEY-----',
  '---- BEGIN SSH2 PUBLIC KEY ----'
]

const endPubHeaders = [
  '-----END RSA PUBLIC KEY-----',
  '-----END PUBLIC KEY-----',
  '-----END DSA PUBLIC KEY-----',
  '---- END SSH2 PUBLIC KEY ----'
]

const beginHeaders = beginPrivHeaders.concat(beginPubHeaders)
const endHeaders = endPrivHeaders.concat(endPubHeaders)

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
    const fake2 = `${beginHeaders[i]}%^${eol}${endHeaders[i]}`
    const fake3 = `${beginHeaders[i]}${eol}AQ==`
    const fake4 = `AQ==${eol}${endHeaders[i]}`

    t.notOk(PEM.matchKey(fake1), `matchKey with eol ${fake1}`)
    t.notOk(PEM.matchKey(fake2), `matchKey with eol ${fake2}`)
    t.notOk(PEM.matchKey(fake3), `matchKey with eol ${fake3}`)
    t.notOk(PEM.matchKey(fake4), `matchKey with eol ${fake4}`)
  }
  t.end()
})

test('Test PEM matchPrivateKey', t => {
  const eols = ['\r', '\r\n', '\n']
  for (let i = 0; i < beginPrivHeaders.length; i++) {
    const eol = eols[i % eols.length]
    const pem = `${beginPrivHeaders[i]}${eol}AQ==${eol}${endPrivHeaders[i]}`
    const match = PEM.matchPrivateKey(pem)

    t.ok(match, `matchPrivateKey ${match} ${pem}`)
    t.ok(match.endsWith('PRIVATE KEY'), `matchPrivateKey ${match}`)

    const fake1 = `${beginPrivHeaders[i]}${endPrivHeaders[i]}`
    const fake2 = `${beginPrivHeaders[i]}${eol}AQ==${eol}${endPubHeaders[i]}`
    t.notOk(PEM.matchKey(fake1), `matchPrivateKey fake ${fake1}`)
    t.notOk(PEM.matchKey(fake2), `matchPrivateKey fake ${fake2}`)
  }
  t.end()
})

test('Test PEM matchPublicKey', t => {
  const eols = ['\r', '\r\n', '\n']
  for (let i = 0; i < beginPubHeaders.length; i++) {
    const eol = eols[i % eols.length]
    const pem = `${beginPubHeaders[i]}${eol}AQ==${eol}${endPubHeaders[i]}`
    const match = PEM.matchPublicKey(pem)

    t.ok(match, `matchPublicKey ${match} ${pem}`)
    t.ok(match.endsWith('PUBLIC KEY'), `matchPublicKey ${match}`)

    const fake1 = `${beginPubHeaders[i]}${endPubHeaders[i]}`
    const fake2 = `${beginPubHeaders[i]}${eol}AQ==${eol}${endPrivHeaders[i]}`
    t.notOk(PEM.matchKey(fake1), `matchPublicKey fake ${fake1}`)
    t.notOk(PEM.matchKey(fake2), `matchPublicKey fake ${fake2}`)
  }
  t.end()
})
