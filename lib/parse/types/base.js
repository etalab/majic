'use strict'

function createParser(mapping) {
  return row => {
    const result = {}

    Object.keys(mapping).forEach(mappingKey => {
      const {start, end, noTrim} = mapping[mappingKey]
      const rawValue = row.slice(start - 1, end)
      const value = (noTrim ? rawValue : rawValue.trim())
      result[mappingKey] = value
    })

    return result
  }
}

module.exports = createParser
