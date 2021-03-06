const test = require('tape')
const PEM = require('../index.js')

const realKey = `

-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDAkCBSOyqYJMMlHhUWhkCwhGra9EDmzV3pzvzztfv/WTMQj2HH
P8rf2fYsojoST7PY+waJidShYI/6c593KJ0atqABmpaCessLtqQlsfhRPgIcVX34
JaPCP/Vs+JKBp1lX3w6xtiHb/JAXIuoyTtGnLURVmIwaIo+3ZbhZXCcI1wIDAQAB
AoGBAJiz8p2jQ9ThGkud/nUdQ8F3UNGPbsRYyYe3WErf3xWQo/kW6yA5y2UXEKw2
fby1rdZ8wqNhRNgwnhyrgiLZdzMtnkkYFV4v9DZOOIPBK8ZS5Pzln+e2JURtBdIy
frZdUCti9DXj1rcbiuILf8Q7qNrT2Tyx+67iEBMy+K6OonZBAkEA8N7m+6atEqyD
m9sAkgn0vo4iAWaIGWFJp3SOriUSQM6qr/6/jbWPh7jQhD/9/Ce3G86yLG4rZ4nk
5/p02sgdIQJBAMyodOJ/RvcPTf4X+6LVD1JZxMCQaMq6Aha8fAdh7dsuvg3egFOo
sISxOJHHozN7oLCkYv3Q5fL16ltIApX3LvcCQH47sz3rSgThWE/T5GakxRkgj/2/
6E+0xs71rNjjIL/KD3YQwf7YShJM7yqABvGhNrtiBcp3KlQm1kok3hzSh0ECQAHo
dCaEb0HwZ5a93H+5IspuwdHVxtRVBZ32peVfuVr4xZbVgzbEdNjX2iIpzVC2j1n2
PmIFZ49rUYMGWdfSFSMCQQC03ee0QjNcUzxK/ntnoFf0fnUTNJZ5miTlKGs/I50m
Mrz/bzr+VtYheKajMhb1JBO3v6BpB+0KE5GS0Q6+NmL5
-----END RSA PRIVATE KEY-----
`

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

    const pem = `${eol}${beginHeaders[i]}AQ==${endHeaders[i]}${eol}`
    const pem2 = `${beginHeaders[i]}AQ==${endHeaders[i]}`

    t.ok(PEM.matchKey(pem), `matchKey with eol ${pem}`)
    t.ok(PEM.matchKey(pem2), `matchKey without eol ${pem}`)

    const fake1 = `${eol}${beginHeaders[i]}${endHeaders[i]}`
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

test('Test PEM matchKey with realKey', t => {
  const match = PEM.matchKey(realKey)
  t.equal(match.label, 'RSA PRIVATE KEY', `matchKey label ${match.label}`)
  t.equal(match.type, 'PRIVATE', `matchKey type ${match.type}`)
  t.end()
})

test('Test PEM isPrivateKey', t => {
  const eols = ['\r', '\r\n', '\n']
  for (let i = 0; i < beginPrivHeaders.length; i++) {
    const eol = eols[i % eols.length]
    const pem = `${beginPrivHeaders[i]}${eol}AQ==${eol}${endPrivHeaders[i]}`
    const match = PEM.isPrivateKey(pem)

    t.ok(match, `matchPrivateKey ${match} ${pem}`)
    t.ok(match.endsWith('PRIVATE KEY'), `matchPrivateKey ${match}`)

    const fake1 = `${beginPrivHeaders[i]}${endPrivHeaders[i]}`
    const fake2 = `${beginPrivHeaders[i]}${eol}AQ==${eol}${endPubHeaders[i]}`
    t.notOk(PEM.matchKey(fake1), `matchPrivateKey fake ${fake1}`)
    t.notOk(PEM.matchKey(fake2), `matchPrivateKey fake ${fake2}`)
  }
  t.end()
})

test('Test PEM isPublicKey', t => {
  const eols = ['\r', '\r\n', '\n']
  for (let i = 0; i < beginPubHeaders.length; i++) {
    const eol = eols[i % eols.length]
    const pem = `${beginPubHeaders[i]}${eol}AQ==${eol}${endPubHeaders[i]}`
    const match = PEM.isPublicKey(pem)

    t.ok(match, `matchPublicKey ${match} ${pem}`)
    t.ok(match.endsWith('PUBLIC KEY'), `matchPublicKey ${match}`)

    const fake1 = `${beginPubHeaders[i]}${endPubHeaders[i]}`
    const fake2 = `${beginPubHeaders[i]}${eol}AQ==${eol}${endPrivHeaders[i]}`
    t.notOk(PEM.matchKey(fake1), `matchPublicKey fake ${fake1}`)
    t.notOk(PEM.matchKey(fake2), `matchPublicKey fake ${fake2}`)
  }
  t.end()
})
