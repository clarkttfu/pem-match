const test = require('tape')
const PEM = require('../index.js')

const beginHeaders = [
  '-----BEGIN CERTIFICATE-----',
  '-----BEGIN TRUSTED CERTIFICATE-----',
  '-----BEGIN X509 CERTIFICATE-----',
  '-----BEGIN CERTIFICATE REQUEST-----',
  '-----BEGIN NEW CERTIFICATE REQUEST-----',
  '-----BEGIN X509 CRL-----'
]

const endHeaders = [
  '-----END CERTIFICATE-----',
  '-----END TRUSTED CERTIFICATE-----',
  '-----END X509 CERTIFICATE-----',
  '-----END CERTIFICATE REQUEST-----',
  '-----END NEW CERTIFICATE REQUEST-----',
  '-----END X509 CRL-----'
]

test('Test PEM key begin headers', t => {
  for (const h of beginHeaders) {
    const match = PEM.matchX509Begin(h)
    t.ok(match, `matchX509Begin ${h}`)
    const line = h.replace(/-/g, '').trim()
    t.ok(line.endsWith(match.label), `matchX509Begin label ${match.label}`)
  }
  t.end()
})

test('Test PEM key end headers', t => {
  for (const h of endHeaders) {
    const match = PEM.matchX509End(h)
    t.ok(match, `matchX509End ${h}`)
    const line = h.replace(/-/g, '').trim()
    t.ok(line.endsWith(match.label), `matchX509End label ${match.label}`)
  }
  t.end()
})

test.skip('Test PEM matchX509', t => {
  const eols = ['\r', '\r\n', '\n']
  for (let i = 0; i < beginHeaders.length; i++) {
    const eol = eols[i % eols.length]

    const pem = `${beginHeaders[i]}${eol}AQ==${eol}${endHeaders[i]}`
    const pem2 = `${beginHeaders[i]}AQ==${endHeaders[i]}`

    t.ok(PEM.matchX509(pem), `matchX509 with eol ${pem}`)
    t.ok(PEM.matchX509(pem2), `matchX509 without eol ${pem}`)

    const fake1 = `${beginHeaders[i]}${eol}${eol}${endHeaders[i]}`
    const fake2 = `${beginHeaders[i]}${eol}AQ==`
    const fake3 = `AQ==${eol}${endHeaders[i]}`

    t.notOk(PEM.matchX509(fake1), `matchX509 with eol ${fake1}`)
    t.notOk(PEM.matchX509(fake2), `matchX509 with eol ${fake2}`)
    t.notOk(PEM.matchX509(fake3), `matchX509 with eol ${fake3}`)
  }
  t.end()
})
