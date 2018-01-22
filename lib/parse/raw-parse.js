'use strict'

function createParser(mapping) {
  const mappingKeys = Object.keys(mapping)

  return line => {
    return mappingKeys
      .map(mappingKey => {
        const {start, end, noTrim} = mapping[mappingKey]
        const rawValue = line.substring(start - 1, end)
        const value = (noTrim ? rawValue : rawValue.trim())
        return [mappingKey, value]
      })
      .reduce((acc, res) => {
        acc[res[0]] = res[1]
        return acc
      }, {})
  }
}

module.exports = createParser
