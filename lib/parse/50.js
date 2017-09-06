'use strict'

const mapping = {
  CCODEP: {start: 1, end: 2},
  CCODIR: {start: 3, end: 3},
  CCOCOM: {start: 4, end: 6},
  INVAR: {start: 7, end: 16},
  CENR: {start: 31, end: 32},

  DNUPEV: {start: 28, end: 30}, // Numéro de PEV
  DNUDES: {start: 33, end: 35}, // Numéro d'ordre de descriptif
  VSURZT: {start: 72, end: 80}, // Surface réelle totale
}

module.exports = require('./raw-parse')(mapping)
