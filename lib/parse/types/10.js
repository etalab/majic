'use strict'

const mapping = {
  CCODEP: {start: 1, end: 2},
  CCODIR: {start: 3, end: 3},
  CCOCOM: {start: 4, end: 6},
  INVAR: {start: 7, end: 16},
  CENR: {start: 31, end: 32},

  GPDL: {start: 36, end: 36},
  DSRPAR: {start: 37, end: 37},
  DNUPRO: {start: 38, end: 43},
  JDATAT: {start: 44, end: 51},
  DNUFNL: {start: 52, end: 57},
  CCOEVA: {start: 58, end: 58},
  DTELOC: {start: 60, end: 60},
  GTAUOM: {start: 61, end: 62},
  DCOMRD: {start: 63, end: 65},
  CCOPLC: {start: 66, end: 66},
  CCONLC: {start: 67, end: 68},
  DVLTRT: {start: 69, end: 77},

  // From this point, no more exhaustivity
  DNATLC: {start: 94, end: 94},
  // ...
  JANNAT: {start: 109, end: 112},
  DNBNIV: {start: 113, end: 114},
  // ...
  POSTEL: {start: 116, end: 116},
  // ...
  FBURX: {start: 148, end: 148},
  // ...
  CCONAC: {start: 169, end: 173}
}

module.exports = require('./base')(mapping)
