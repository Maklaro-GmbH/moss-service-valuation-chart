#!/usr/bin/env node

require('../build/generateChart')
  .generateChart(process.stdin)
  .then((buffer) => {
    process.stdout.write(buffer)
    process.exitCode = 0
  })
  .catch((error) => {
    // the error can be anything, let the `console` handle printing it
    console.error(error)
    process.exitCode = 1
  })
