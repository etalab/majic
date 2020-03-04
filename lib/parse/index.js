const split = require('split2')
const {createGunzip} = require('gunzip-stream')
const pumpify = require('pumpify')
const parseRowStream = require('./row')

function parse(options) {
  return pumpify.obj(
    createGunzip(),
    split(),
    parseRowStream(options)
  )
}

module.exports = parse
