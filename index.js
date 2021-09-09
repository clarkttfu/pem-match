'use strict'

const PATTERN_KEY_BEGIN = /^----[- ]BEGIN (?<label>(?:(?:[A-Z][A-Z0-9]+) )?(?<type>PRIVATE|PUBLIC) KEY)[ -]----/
const PATTERN_KEY_END = /----[- ]END (?<label>(?:(?:[A-Z][A-Z0-9]+) )?(?<type>PRIVATE|PUBLIC) KEY)[ -]----$/
const PATTERN_X509_BEGIN = /^-----BEGIN (?<label>(?:(?:TRUSTED |X509 )?(?:CERTIFICATE))|(?:(?:NEW )?CERTIFICATE REQUEST)|(?:X509 (?:CRL)))-----/
const PATTERN_X509_END = /-----END (?<label>(?:(?:TRUSTED |X509 )?(?:CERTIFICATE))|(?:(?:NEW )?CERTIFICATE REQUEST)|(?:X509 (?:CRL)))-----$/

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.returnExports = factory()
  }
}(typeof self !== 'undefined' ? self : this, function () {
  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {
    matchKey,
    matchPrivateKey,
    matchPublicKey,
    matchKeyBegin: pem => matchBegin(pem, PATTERN_KEY_BEGIN),
    matchKeyEnd: pem => matchEnd(pem, PATTERN_KEY_END),
    matchX509,
    matchX509Begin: pem => matchBegin(pem, PATTERN_X509_BEGIN),
    matchX509End: pem => matchEnd(pem, PATTERN_X509_END),
    trimLines
  }
}))

function matchPrivateKey (pem) {
  const match = matchKey(pem)
  if (match && match.type === 'PRIVATE') {
    return match.label
  }
}

function matchPublicKey (pem) {
  const match = matchKey(pem)
  if (match && match.type === 'PUBLIC') {
    return match.label
  }
}

function matchKey (pem) {
  const beginMatch = matchBegin(pem, PATTERN_KEY_BEGIN)
  const endMatch = matchEnd(pem, PATTERN_KEY_END)

  if (beginMatch && endMatch) {
    if (beginMatch.label !== endMatch.label ||
      beginMatch.type !== endMatch.type) {
      return
    }

    const key = pem.replace(PATTERN_KEY_BEGIN, '')
      .replace(PATTERN_KEY_END, '')

    if (isValidBase64(key)) {
      return beginMatch
    }
  }
}

function isValidBase64 (content) {
  if (content && typeof content === 'string') {
    const joinedLines = content.replace(/\n|\r\n/g, '')
    if (!joinedLines) {
      return false
    }

    if (typeof atob === 'function') {
      try {
        // eslint-disable-next-line no-undef
        return !!atob(joinedLines)
      } catch (err) {
      }
    } else {
      return !!Buffer.from(joinedLines, 'base64').length
    }
  }
}

function matchX509 (pem) {
  const beginMatch = matchBegin(pem, PATTERN_X509_BEGIN)
  const endMatch = matchEnd(pem, PATTERN_X509_END)

  if (beginMatch && endMatch) {
    if (beginMatch.label !== endMatch.label ||
      beginMatch.type !== endMatch.type) {
      return
    }

    const key = pem.replace(PATTERN_X509_BEGIN, '')
      .replace(PATTERN_X509_END, '')

    if (isValidBase64(key)) {
      return beginMatch
    }
  }
}

function matchBegin (pem, pattern) {
  const lines = trimLines(pem)
  if (lines) {
    const match = trimLines(lines).match(pattern)
    return match && match.groups
  }
}

function matchEnd (pem, pattern) {
  const lines = trimLines(pem)
  if (lines) {
    const lastLine = lines.substring(lines.lastIndexOf('\n') + 1)
    const match = lastLine.match(pattern)
    return match && match.groups
  }
}

function trimLines (input) {
  if (typeof input === 'string') {
    return input.trim()
  }
}
