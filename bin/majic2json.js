#!/usr/bin/env node
'use strict'

const {serialize} = require('ndjson')
const {parse} = require('../')

process.stdin
  .pipe(parse({profile: 'simple'}))
  .pipe(serialize())
  .pipe(process.stdout)
