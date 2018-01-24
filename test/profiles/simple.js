const {join} = require('path')
const test = require('ava')
const loadJsonFile = require('load-json-file')
const createLocal = require('../../lib/profiles/simple/local')

function loadFixture(fileName) {
  return loadJsonFile(join(__dirname, '..', 'fixtures', fileName))
}

test('example', async t => {
  const localData = await loadFixture('maison.json')
  t.deepEqual(createLocal(localData), {
    invariant: '0180002549',
    codeDepartement: '54',
    codeCommune: '54018',
    codeParcelle: '54018000AB0117',
    numero: '14',
    libelleVoie: 'RUE PASTEUR',
    codeVoie: '0180',
    batiment: 'A',
    etage: '00',
    entree: '01',
    numeroLocal: '01001',
    anneeConstruction: '1840',
    natureLocal: 'Maison',
    categorieLocal: 'maison',
    codeNACE: undefined,
    composition: [
      'Partie principale d’habitation',
      'Garage',
      'Cave',
      'Grenier'
    ]
  })
})
