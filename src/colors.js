const { env, stdout } = require('process')
const { isTTY, getColorDepth } = stdout

const DEPTH_TO_LEVEL = { 1: '0', 4: '1', 8: '2', 24: '3' }

// Set the amount of colors to use by `chalk` (and underlying `supports-color`)
// 0 is no colors, 1 is 16 colors, 2 is 256 colors, 3 is 16 million colors.
function setColorLevel() {
  if (env.FORCE_COLOR) {
    return
  }
  env.FORCE_COLOR = getColorLevel()
}

function getColorLevel() {
  // If the output is not a console (e.g. redirected to `less` or to a file),
  // we disable colors because ANSI sequences are a problem most of the time in
  // that case
  if (!isTTY) {
    return '0'
  }

  // Node <9.9.0 does not have `getColorDepth()`. Default to 16 colors then.
  if (getColorDepth === undefined) {
    return '1'
  }

  // Guess how many colors are supported, mostly based on environment variables
  // This allows using 256 colors or 16 million colors on terminals that
  // support it
  return DEPTH_TO_LEVEL[getColorDepth()]
}

function hasColors() {
  return env.FORCE_COLOR !== '0' && env.FORCE_COLOR !== 'false'
}

module.exports = { setColorLevel, hasColors }
