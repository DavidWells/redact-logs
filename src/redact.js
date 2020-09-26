const redactEnv = require('redact-env')
const mapObj = require('map-obj')
const replaceStream = require('replacestream')

function getSecrets(secretKeys) {
  return redactEnv.build(secretKeys)
}

function redactValues(target, secrets, replacement) {
  const type = typeof target

  if (type === 'string') {
    return redactEnv.redact(target, secrets, replacement)
  }

  if (type === 'function') {
    return redactEnv.redact(target.toString(), secrets, replacement)
  }

  if (target instanceof Error) {
    return redactEnv.redact(target.stack, secrets, replacement)
  }

  if (Array.isArray(target)) {
    return target.map(value => redactValues(value, secrets))
  }

  if (type === 'object' && target !== null) {
    return mapObj(target, (key, value) => [redactValues(key, secrets), redactValues(value, secrets)], { deep: true })
  }

  return target
}

function redactStream(secrets) {
  return replaceStream(secrets, '[secrets]')
}

module.exports = {
  getSecrets,
  redactValues,
  redactStream
}
