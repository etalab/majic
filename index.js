'use strict'

const split = require('split2')
const {createGunzip} = require('gunzip-stream')
const {pipeline} = require('mississippi')
const parse = require('./lib/parse')

exports.parse = function () {
  return pipeline.obj(
    createGunzip(),
    split(),
    parse()
  )
}
