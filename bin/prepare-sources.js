#!/usr/bin/env node
'use strict'

const {resolve, join} = require('path')
const {readdir, unlink, createReadStream, createWriteStream} = require('fs')
const {promisify} = require('util')
const {createGzip} = require('zlib')
const {pipeline} = require('stream')

const execa = require('execa')
const {dir} = require('tmp-promise')
const bluebird = require('bluebird')
const multistream = require('multistream')
const pumpify = require('pumpify')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const program = require('commander')

const readdirAsync = promisify(readdir)
const unlinkAsync = promisify(unlink)
const mkdirpAsync = promisify(mkdirp)
const rimrafAsync = promisify(rimraf)
const pipelineAsync = promisify(pipeline)

const version = require('../package.json')

async function prepareSources(providedArchivesPath, destPath, onlyDepartements) {
  destPath = resolve(destPath)
  providedArchivesPath = resolve(providedArchivesPath)

  await rimrafAsync(destPath)

  const providedArchives = await readdirAsync(providedArchivesPath)

  const departements = providedArchives
    .map(providedArchive => {
      const res = providedArchive.match(/(\d{1}[0-9AB]{1}\d{1})/i)
      if (!res) return null
      const codeDirection = res[1].toUpperCase()
      const codeDepartement = getCodeDepartement(codeDirection)
      return {
        codeDepartement,
        archivePath: join(providedArchivesPath, providedArchive)
      }
    })
    .reduce((acc, providedArchive) => {
      if (providedArchive) {
        if (!(providedArchive.codeDepartement in acc)) {
          acc[providedArchive.codeDepartement] = []
        }

        acc[providedArchive.codeDepartement].push(providedArchive.archivePath)
      }

      return acc
    }, {})

  await bluebird.each(Object.keys(departements), async codeDepartement => {
    if (onlyDepartements && !onlyDepartements.includes(codeDepartement)) return
    const archivesPaths = departements[codeDepartement]

    const departementPath = join(destPath, 'departements', codeDepartement)
    await mkdirpAsync(departementPath)

    const outputDatasets = {
      BATI: createGzipWriteStream(join(departementPath, 'BATI.gz'))
      // LLOC: createGzipWriteStream(join(departementPath, 'LLOC.gz')),
      // PDLL: createGzipWriteStream(join(departementPath, 'PDLL.gz')),
    }

    const inputDatasets = {
      BATI: []
      // LLOC: [],
      // PDLL: [],
    }

    const cleanupHooks = await Promise.all(
      archivesPaths.map(async archivePath => {
        const tempDir = await dir({unsafeCleanup: true})
        console.time('  extracted ' + archivePath)
        await decompress(archivePath, tempDir.path)
        console.timeEnd('  extracted ' + archivePath)

        // Eventually decompress contained archives
        const archiveContent = await readdirAsync(tempDir.path)
        await Promise.all(
          archiveContent
            .filter(file => file.toLowerCase().endsWith('.zip'))
            .map(async containedArchive => {
              const containedArchivePath = join(tempDir.path, containedArchive)
              await decompress(containedArchivePath, tempDir.path)
              await unlinkAsync(containedArchivePath)
            })
        )

        const finalArchiveContent = await readdirAsync(tempDir.path)

        finalArchiveContent
          .forEach(file => {
            // Const matchResult = file.match(/\.(BATI|LLOC|PDLL)\./)
            const matchResult = file.match(/\.(BATI)\./)
            if (matchResult) {
              const datasetName = matchResult[1]
              const filePath = join(tempDir.path, file)
              inputDatasets[datasetName].push(createReadStream(filePath))
            }
          })

        return () => tempDir.cleanup()
      })
    )

    await pipelineAsync(multistream(inputDatasets.BATI), outputDatasets.BATI)
    console.log('  pumped BATI')
    // Await pipeAsync(multistream(inputDatasets.LLOC), outputDatasets.LLOC)
    // console.log('  pumped LLOC')
    // await pipeAsync(multistream(inputDatasets.PDLL), outputDatasets.PDLL)
    // console.log('  pumped PDLL')

    cleanupHooks.forEach(cleanupHook => cleanupHook())
  })
}

function getCodeDepartement(codeDirection) {
  if (codeDirection.startsWith('97')) return codeDirection
  if (codeDirection.startsWith('92')) return '92'
  if (codeDirection.startsWith('13')) return '13'
  if (codeDirection.startsWith('59')) return '59'
  if (codeDirection.startsWith('75')) return '75'
  return codeDirection.substr(0, 2)
}

function decompress(archivePath, destPath) {
  return execa('unar', ['-D', '-o', destPath, archivePath])
}

function createGzipWriteStream(path) {
  return pumpify(
    createGzip(),
    createWriteStream(path)
  ).on('error', boom)
}

function boom(err) {
  console.error(err)
  process.exit(1)
}

program
  .version(version)
  .arguments('<directionArchivesPath> <targetPath>')
  .option('-d, --departements <list>', 'Liste des départements à préparer', v => v.split(','))
  .action((directionArchivesPath, targetPath, {departements}) => {
    prepareSources(directionArchivesPath, targetPath, departements)
      .catch(boom)
  })
  .parse(process.argv)
