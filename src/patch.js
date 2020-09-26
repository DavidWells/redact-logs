const { redactValues } = require('./redact')
const serialize = require('./serialize')

module.exports.patchConsoleLog = (secrets, opts) => {
  const originalConsoleLog = console.log
  // Patch
  console.log = new Proxy(console.log, monkeyPatchLogs(secrets, opts))
  // Restore
  return () => {
    console.log = originalConsoleLog
  }
}

module.exports.patchProcessStdOut = (secrets, opts) => {
  const boundProcessStdout = process.stdout.write.bind(process.stdout)
  const boundProcessStderr = process.stderr.write.bind(process.stderr)

  process.stdout.write = (string, encoding, fd) => {
    const redactedString = redact(string, secrets, opts)
    boundProcessStdout(redactedString, encoding, fd)
  }

  process.stderr.write = (string, encoding, fd) => {
    const redactedString = redact(string, secrets, opts)
    boundProcessStderr(redactedString, encoding, fd)
  }

  return () => {
    process.stdout.write = boundProcessStdout
    process.stderr.write = boundProcessStderr
  }
}

function redact(string, secrets, opts) {
  let redactedValue = redactValues(string, secrets, opts.redactionText)
  if (typeof string === 'object') {
    redactedValue = serialize(redactedValue)
  }
  return redactedValue
}

function monkeyPatchLogs(secrets, opts) {
  return {
    apply(proxy, context, args) {
      if (!args.length) {
        return Reflect.apply(proxy, context, args)
      }
      const redactedArgs = args.map(a => redact(a, secrets, opts))
      return Reflect.apply(proxy, context, redactedArgs)
    }
  }
}
