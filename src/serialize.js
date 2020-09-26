const util = require('util')

const { hasColors } = require('./colors')

// Serialize object for printing
function serialize(obj) {
  return util.inspect(obj, { depth: null, colors: hasColors() })
}

module.exports = serialize
