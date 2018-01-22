'use strict'

const mapping = {
  CCODEP: {start: 1, end: 2},
  CCODIR: {start: 3, end: 3},
  CCOCOM: {start: 4, end: 6},
  INVAR: {start: 7, end: 16},
  CENR: {start: 31, end: 32},

  DNUPEV: {start: 28, end: 30}, // Numéro de PEV
  // ...
  AELIHP: {start: 36, end: 75, noTrim: true},
  // ...
  JANNAT: {start: 121, end: 124},
  // ...
  DNBNIV: {start: 126, end: 127}
}

const codes = require('./codes')
const parseRaw = require('./raw-parse')(mapping)

module.exports = function (line) {
  const res = parseRaw(line)

  res._elementsIncorpores = [0, 10, 20, 30]
    .map(start => res.AELIHP.substr(start, 10).trim())
    .filter(segment => segment.length === 10 && segment !== '0000000000')
    .map(segment => ({
      CCONAD: codes.CCONAD[segment.substr(0, 2)],
      DSUEIC: segment.substr(2, 8),
      DCIMEI: segment.substr(8, 2)
    }))

  return res
}
