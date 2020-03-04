const Keyv = require('keyv')
const intoStream = require('into-stream')
const getStream = require('get-stream')
const parse = require('./parse')

function getDbPath() {
  const {MAJIC_PATH} = process.env

  if (!MAJIC_PATH) {
    throw new Error('MAJIC_PATH must be defined')
  }

  return MAJIC_PATH
}

let _db

function getDb() {
  if (!_db) {
    _db = new Keyv(`sqlite://${getDbPath()}`)
  }

  return _db
}

async function getCommuneData(codeCommune, options = {}) {
  const db = getDb()
  const rawData = await db.get(`BATI-${codeCommune}`)

  if (!rawData) {
    return
  }

  return getStream.array(
    intoStream(rawData)
      .pipe(parse(options))
  )
}

module.exports = {getCommuneData}
