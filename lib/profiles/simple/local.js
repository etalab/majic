const {padStart, trimStart} = require('lodash')
const codes = require('../../codes')
const modernizedCodes = require('./codes')

function getCodeDepartement({CCODEP, CCOCOM}) {
  return CCODEP === '97' ? CCODEP + CCOCOM.charAt(0) : CCODEP
}

function getCodeCommune({CCODEP, CCOCOM}) {
  return CCODEP + CCOCOM
}

function getCodeParcelle({CCODEP, CCOCOM, CCOPRE, CCOSEC, DNUPLA}) {
  const prefixe = CCOPRE || '000'
  const codeSection = padStart(CCOSEC, 2, '0')
  const numeroParcelle = padStart(DNUPLA, 4, '0')
  return CCODEP + CCOCOM + prefixe + codeSection + numeroParcelle
}

function getCodeVoie({CCORIV}) {
  if (CCORIV.length === 4) {
    return CCORIV
  }
}

function getNumero({DNVOIRI}) {
  const numero = trimStart(DNVOIRI, '0')
  if (numero.length > 0) return numero
}

function getRepetition({DNVOIRI, DINDIC}) {
  if (DNVOIRI === '0000') return
  const trimmedValue = DINDIC.trim()
  if (trimmedValue) return trimmedValue
}

function getAnneeConstruction({JANNAT}) {
  if (JANNAT !== '0000') {
    return JANNAT
  }
}

function getComposition(record) {
  const composition = new Set()

  Object.values(record._pev).forEach(pev => {
    if (pev._pp) {
      composition.add('Partie professionnelle')
    }
    pev._dep.forEach(dep => {
      const natureDependance = codes.CCONAD[dep.CCONAD]
      composition.add(natureDependance)
    })
    pev._pph.forEach(pph => {
      composition.add('Partie principale d’habitation')
      pph._elementsIncorpores.forEach(ei => {
        const natureDependance = codes.CCONAD[ei.CCONAD]
        composition.add(natureDependance)
      })
    })
  })

  return Array.from(composition)
}

function getCodeNACE({CCONAC}) {
  if (CCONAC) {
    return CCONAC
  }
}

function createLocal(record) {
  return {
    invariant: record.INVAR,
    // Rattachement administratif
    codeDepartement: getCodeDepartement(record),
    codeCommune: getCodeCommune(record),
    // Cadastre
    codeParcelle: getCodeParcelle(record),
    // Adresse
    numero: getNumero(record),
    repetition: getRepetition(record),
    libelleVoie: record.DVOILIB.replace(/\s\s/g, ' '),
    codeVoie: getCodeVoie(record),
    // Complément d'adresse
    batiment: record.DNUBAT,
    etage: record.DNIV,
    entree: record.DESC,
    numeroLocal: record.DPOR,

    natureLocal: codes.CCONLC[record.CCONLC],
    categorieLocal: modernizedCodes.CATEGORIES_LOCAL[record.CCONLC],
    anneeConstruction: getAnneeConstruction(record),

    composition: getComposition(record),

    // Activité
    codeNACE: getCodeNACE(record)
  }
}

module.exports = createLocal
