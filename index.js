'use strict'

const parse = require('./lib/parse')
const split = require('split2')
const {pipeline} = require('mississippi')

exports.parse = function () {
  return pipeline.obj(
    split(),
    parse()
  )
}
