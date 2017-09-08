#!/usr/bin/env node
'use strict'

const {serialize} = require('ndjson')
const split = require('split2')
const {parse} = require('../')

process.stdin
  .pipe(parse())
  .pipe(serialize())
  .pipe(process.stdout)
