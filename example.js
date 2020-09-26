const execa = require('execa')
const startPatchingLogs = require('./src/index')

process.env.SECRET_ENV_VAR = 'secret value'
process.env.MY_API_KEY = 'xyz123'
process.env.PUBLIC_ENV_VAR = 'public value'

async function run() {
  console.log('───────────────────────')
  console.log('Raw Logs')
  console.log('───────────────────────')
  console.log('console.log(process.env.SECRET_ENV_VAR)', process.env.SECRET_ENV_VAR)
  console.log('console.log(process.env.MY_API_KEY)', process.env.MY_API_KEY)
  process.stdout.write(`process.stdout.write(process.env.SECRET_ENV_VAR) ${process.env.SECRET_ENV_VAR}\n`)
  process.stderr.write(`process.stderr.write(process.env.SECRET_ENV_VAR) ${process.env.SECRET_ENV_VAR}\n`)

  const SECRET_KEYS = ['SECRET_ENV_VAR', 'MY_API_KEY']
  const restoreLogs = startPatchingLogs(SECRET_KEYS)
  /*
  const restoreLogs = startPatchingLogs(SECRET_KEYS, {
    redactionText: '[Removed for privacy]'
  })
  /**/

  console.log()
  console.log('───────────────────────')
  console.log('Redacted Logs')
  console.log('───────────────────────')
  console.log(`console.log   SECRET_ENV_VAR ${process.env.SECRET_ENV_VAR}`)
  console.warn(`console.warn  SECRET_ENV_VAR ${process.env.SECRET_ENV_VAR}`)
  console.info(`console.info  SECRET_ENV_VAR ${process.env.SECRET_ENV_VAR}`)
  console.debug(`console.debug SECRET_ENV_VAR ${process.env.SECRET_ENV_VAR}`)
  console.log('console.log(process.env.MY_API_KEY)', process.env.MY_API_KEY)
  console.log('console.log   PUBLIC_ENV_VAR', process.env.PUBLIC_ENV_VAR)

  process.stdout.write(`process.stdout.write(process.env.SECRET_ENV_VAR) ${process.env.SECRET_ENV_VAR}\n`)
  process.stderr.write(`process.stderr.write(process.env.SECRET_ENV_VAR) ${process.env.SECRET_ENV_VAR}\n`)

  // Printenv also redacted
  const { stdout } = await execa.command('printenv')
  console.log()
  console.log('───────────────────────')
  console.log('Redacted printenv')
  console.log('───────────────────────')
  console.log(stdout)

  restoreLogs()

  console.log()
  console.log('───────────────────────')
  console.log('Restored Logs')
  console.log('───────────────────────')
  console.log('console.log(process.env.SECRET_ENV_VAR)', process.env.SECRET_ENV_VAR)
  process.stdout.write(`process.stdout.write(process.env.SECRET_ENV_VAR) ${process.env.SECRET_ENV_VAR}\n`)
  process.stderr.write(`process.stderr.write(process.env.SECRET_ENV_VAR) ${process.env.SECRET_ENV_VAR}\n`)
}

run()
