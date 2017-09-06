#!/usr/bin/env node
'use strict'

const {serialize} = require('ndjson')
const split = require('split2')
const parse = require('../lib/parse')

process.stdin
  .pipe(split())
  .pipe(parse())
  .pipe(serialize())
  .pipe(process.stdout)
