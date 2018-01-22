'use strict'

const mapping = {
  CCODEP: {start: 1, end: 2},
  CCODIR: {start: 3, end: 3},
  CCOCOM: {start: 4, end: 6},
  INVAR: {start: 7, end: 16},
  CENR: {start: 31, end: 32},

  DNUPEV: {start: 28, end: 30}, // Numéro de PEV
  CCOAFF: {start: 36, end: 36}, // Affectation de la PEV
  // ...
  DVLPER: {start: 52, end: 60},
  DVLPERA: {start: 61, end: 69},
  // ...
  CCTHP: {start: 102, end: 102},
  // ...
  DVLTPE: {start: 153, end: 161}
}

module.exports = require('./raw-parse')(mapping)
