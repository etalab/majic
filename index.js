'use strict'

const split = require('split2')
const {pipeline} = require('mississippi')
const parse = require('./lib/parse')

exports.parse = function () {
  return pipeline.obj(
    split(),
    parse()
  )
}
