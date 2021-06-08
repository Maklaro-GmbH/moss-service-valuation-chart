#!/usr/bin/env node

require('ts-node').register({
  transpileOnly: true
})

require('../src/generateChart')
  .generateChart(process.stdin)
  .then((buffer) => {
    process.stdout.write(buffer)
    process.exitCode = 0
  })
  .catch((error) => {
    process.stderr.write(error)
    process.exitCode = 1
  })
