const test = require('tape')
const PEM = require('../index.js')

test('Test PEM tools', t => {
  t.test('trimLines invalid inputs', st => {
    t.strictEqual(PEM.trimLines(), undefined, 'trimLines()')
    t.strictEqual(PEM.trimLines(1), undefined, 'trimLines(1)')
    t.strictEqual(PEM.trimLines(null), undefined, 'trimLines(null)')
    st.end()
  })

  t.test('trimLines', st => {
    t.strictEqual(PEM.trimLines(''), '', 'trimLines("")')
    t.strictEqual(PEM.trimLines('abc'), 'abc', 'trimLines("abc")')
    t.strictEqual(PEM.trimLines('\n\r\nabc\r\n\n'), 'abc', 'trimLines("\n\r\nabc\r\n\n")')
    t.strictEqual(PEM.trimLines('\n\na\nb\r\nc\n\n'), 'a\nb\r\nc', 'trimLines("\n\na\nb\r\nc\n\n")')
    st.end()
  })

  // t.test('matchBegin', st => {
  //   t.strictEqual(PEM.matchBegin(), undefined, 'matchBegin()')
  //   t.strictEqual(PEM.matchBegin(''), undefined, 'matchBegin("")')
  //   t.strictEqual(PEM.matchBegin('abc', 'bc'), null, 'matchBegin("abc", "bc")')
  //   t.strictEqual(PEM.matchBegin('abc', 'ab')[0], 'ab', 'matchBegin("abc", "ab")')
  //   t.strictEqual(PEM.matchBegin('\r\n\nabc', 'ab')[0], 'ab', 'matchBegin("abc", "ab")')
  //   st.end()
  // })

  // t.test('matchEnd', st => {
  //   t.strictEqual(PEM.matchEnd(), undefined, 'matchEnd("")')
  //   t.strictEqual(PEM.matchEnd(''), undefined, 'matchEnd("")')
  //   t.strictEqual(PEM.matchEnd('abc', 'ab'), null, 'matchEnd("abc", "ab")')
  //   t.strictEqual(PEM.matchEnd('abc', 'bc')[0], 'bc', 'matchEnd("abc", "bc")[0]')
  //   t.strictEqual(PEM.matchEnd('\nabc\r\nbcd\ndef\n\r\n', 'ef')[0], 'ef', 'matchEnd("abc", "ab")')
  //   st.end()
  // })
})
