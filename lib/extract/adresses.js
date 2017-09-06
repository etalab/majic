'use strict'

const through = require('mississippi').through.obj

function extract() {
  let currentCommune
  let adressesIndex = {}
  let pseudoNum

  function flushAdresses(stream) {
    Object.values(adressesIndex).forEach(adresse => stream.push(adresse))
  }

  return through(
    // Transform function
    function (local, enc, cb) {
      if (!isValid(local)) return cb()

      const typeLocal = local.DTELOC
      const numero = parseNumero(local.DNVOIRI) || pseudoNum++
      const commune = local.CCODEP + local.CCOCOM
      const parcelle = commune + local.CCOPRE.padStart(3, '0') + local.CCOSEC.padStart(2, '0') + local.DNUPLA.padStart(4, '0')
      const rivoli = local.CCORIV
      const voie = local.DVOILIB
      const repetition = local.DINDIC
      const typeAdressage = numero < 5000 ? 'normal' : 'fictif'
      const id = `${commune}-${rivoli}-${numero}${repetition || ''}`

      if (commune !== currentCommune) {
        flushAdresses(this)
        currentCommune = commune
        adressesIndex = {}
        pseudoNum = 10000
      }

      if (!(id in adressesIndex)) {
        adressesIndex[id] = {
          id,
          typeAdressage,
          commune,
          rivoli,
          numero,
          voie,
          repetition,
          parcelles: [parcelle],
        }
      } else {
        const parcelles = adressesIndex[id].parcelles
        if (!parcelles.includes(parcelle)) {
          // Il serait préférable d'indique le type de local car toutes les parcelles
          // n'ont pas forcément la même valeur d'adressage
          parcelles.push(parcelle)
        }
      }

      cb()
    },
    // Flush function
    function (cb) {
      flushAdresses(this)
      cb()
    }
  )
}

function isValid(local) {
  const numero = parseNumero(local.DNVOIRI)
  const typeLocal = local.DTELOC
  if (numero && numero < 5000) return true
  if (['Maison', 'Appartement'].includes(typeLocal)) return true
  return false
}

function parseNumero(string) {
  if (!string || string === '0000') return
  return parseInt(string, 10).toString()
}

module.exports = extract
