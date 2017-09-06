#!/usr/bin/env node
'use strict'

const {serialize} = require('ndjson')
const split = require('split2')
const parse = require('../lib/parse')
const extract = require('../lib/extract/adresses')

process.stdin
  .pipe(split())
  .pipe(parse())
  .pipe(extract())
  .pipe(serialize())
  .pipe(process.stdout)
