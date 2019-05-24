'use strict'

const through = require('mississippi').through.obj

const parse00 = require('./types/00')
const parse10 = require('./types/10')
const parse21 = require('./types/21')
const parse40 = require('./types/40')
const parse50 = require('./types/50')
const parse60 = require('./types/60')

function parse(options = {}) {
  const createLocal = options.profile ? require('../profiles/' + options.profile).createLocal : x => x
  let currentLocal

  return through(function (line, enc, cb) {
    const codeEnr = line.substr(30, 2)

    if (codeEnr === '00') {
      if (currentLocal) {
        currentLocal._pev = Object.values(currentLocal._pev)
        this.push(createLocal(currentLocal))
      }

      currentLocal = parse00(line)
      currentLocal._pev = {}
    } else if (codeEnr === '10') {
      Object.assign(currentLocal, parse10(line))
    } else if (codeEnr === '21') {
      const pev = parse21(line)
      pev._pph = []
      pev._dep = []
      currentLocal._pev[pev.DNUPEV] = pev
    } else if (codeEnr === '40') {
      const pph = parse40(line)
      const currentPev = currentLocal._pev[pph.DNUPEV]
      currentPev._pph.push(pph)
    } else if (codeEnr === '50') {
      const pp = parse50(line)
      const currentPev = currentLocal._pev[pp.DNUPEV]
      currentPev._pp = pp
    } else if (codeEnr === '60') {
      const dep = parse60(line)
      const currentPev = currentLocal._pev[dep.DNUPEV]
      currentPev._dep.push(dep)
    }

    cb()
  }, function (cb) {
    this.push(createLocal(currentLocal))
    cb()
  })
}

module.exports = parse
