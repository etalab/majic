'use strict'

const mapping = {
  CCODEP: {start: 1, end: 2},
  CCODIR: {start: 3, end: 3},
  CCOCOM: {start: 4, end: 6},
  INVAR: {start: 7, end: 16},
  CENR: {start: 31, end: 32},

  DNUPEV: {start: 28, end: 30}, // Numéro de PEV
  DNUDES: {start: 33, end: 35}, // Numéro d'ordre de descriptif
  DSUDEP: {start: 36, end: 41}, // Surface réelle de la dépendance
  CCONAD: {start: 42, end: 43}, // Nature de dépendance
  ASITET: {start: 44, end: 49}, // Localisation (bat, escalier, niveau)
}

module.exports = require('./raw-parse')(mapping)
