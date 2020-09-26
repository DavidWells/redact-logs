const { patchConsoleLog, patchProcessStdOut } = require('./patch')
const { getSecrets } = require('./redact')

// Monkey patch console.log() to redact secrets
function patchLogs(secrets, opts = {}) {
  const redactedKeys = getSecrets(secrets)
  const restoreConsoleLog = patchConsoleLog(redactedKeys, opts)
  const restoreStdOut = patchProcessStdOut(redactedKeys, opts)

  // Return restore function
  return () => {
    restoreConsoleLog()
    restoreStdOut()
  }
}

module.exports = patchLogs
