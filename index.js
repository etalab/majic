'use strict'

const split = require('split2')
const {createGunzip} = require('gunzip-stream')
const pumpify = require('pumpify')
const parse = require('./lib/parse')

exports.parse = function (options) {
  return pumpify.obj(
    createGunzip(),
    split(),
    parse(options)
  )
}
