'use strict'

const mapping = {
  CCODEP: {start: 1, end: 2},
  CCODIR: {start: 3, end: 3},
  CCOCOM: {start: 4, end: 6},
  INVAR: {start: 7, end: 16},
  CENR: {start: 31, end: 32},

  /* Identifiant cadastral */
  CCOPRE: {start: 36, end: 38},
  CCOSEC: {start: 39, end: 40},
  DNUPLA: {start: 41, end: 44},
  DNUBAT: {start: 46, end: 47},
  DESC: {start: 48, end: 49},
  DNIV: {start: 50, end: 51},
  DPOR: {start: 52, end: 56},

  /* Identifiant adresse */
  CCORIV: {start: 57, end: 60},
  CCOVOI: {start: 62, end: 66},

  /* Voirie */
  DNVOIRI: {start: 67, end: 70},
  DINDIC: {start: 71, end: 71},
  CCOCIF: {start: 72, end: 75},
  DVOILIB: {start: 76, end: 105},
  CLEINVAR: {start: 106, end: 106}
}

module.exports = require('./base')(mapping)
