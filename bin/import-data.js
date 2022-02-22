#!/usr/bin/env node
const {promisify} = require('util')
const {createReadStream} = require('fs')
const {resolve, join} = require('path')
const {Transform, pipeline} = require('stream')
const {createGzip} = require('zlib')
const bluebird = require('bluebird')
const Keyv = require('keyv')
const {createGunzip} = require('gunzip-stream')
const intoStream = require('into-stream')
const getStream = require('get-stream')
const split = require('split2')
const {readdir} = require('fs-extra')

const pipelineAsync = promisify(pipeline)

function getSourcesPath() {
  if (process.argv.length === 2) {
    return resolve('./data')
  }

  if (process.argv.length !== 3) {
    console.error('Cette commande doit être appelée avec un seul argument : le chemin vers le répertoire contenant les fichiers MAJIC.')
    process.exit(1)
  }

  return resolve(process.argv[2])
}

const sourcesPath = getSourcesPath()

const db = new Keyv('sqlite://majic.sqlite')

function getCodeCommune(row) {
  return (row.slice(0, 2) + row.slice(3, 6)).trim()
}

function joinStream(separator = '\n') {
  return new Transform({
    transform(item, enc, cb) {
      cb(null, item + separator)
    }
  })
}

async function importFile(fileType, sourceFilePath) {
  let currentCommune
  let rows = []

  async function importCommune() {
    if (!currentCommune || rows.length === 0) {
      return
    }

    const data = await getStream.buffer(
      intoStream(rows).pipe(joinStream()).pipe(createGzip())
    )

    const key = `${fileType}-${currentCommune}`

    await db.set(key, data)
    console.log(`* ${key} importé`)
  }

  await pipelineAsync(
    createReadStream(sourceFilePath),
    createGunzip(),
    split(),
    new Transform({
      async transform(row, enc, cb) {
        const codeCommune = getCodeCommune(row)

        if (codeCommune.length !== 5) {
          return cb()
        }

        if (codeCommune !== currentCommune) {
          await importCommune()
          currentCommune = codeCommune
          rows = []
        }

        rows.push(row)
        cb()
      },

      async flush(cb) {
        await importCommune()
        cb()
      },

      objectMode: true
    })
  )
}

function detectFileType(fileName) {
  if (fileName.includes('BATI')) {
    return 'BATI'
  }

  if (fileName.includes('NBAT')) {
    return 'NBAT'
  }

  if (fileName.includes('PROP')) {
    return 'PROP'
  }

  if (fileName.includes('LLOC')) {
    return 'LLOC'
  }

  if (fileName.includes('PDLL')) {
    return 'PDLL'
  }
}

async function main() {
  const fileNames = await readdir(sourcesPath)

  await bluebird.each(fileNames, async fileName => {
    const fileType = detectFileType(fileName)

    if (!fileType) {
      console.log(`Fichier ${fileName} inconnu`)
      return
    }

    console.log(`Import du fichier ${fileName} - ${fileType}`)
    await importFile(fileType, join(sourcesPath, fileName))
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
