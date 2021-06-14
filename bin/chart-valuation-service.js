#!/usr/bin/env node

require('ts-node').register({
  project: require('path').resolve(__dirname, '..', 'tsconfig.json'), // setting the `project` allows to use this package as a typescript "binary"
  transpileOnly: true
})

require('../src/generateChart')
  .generateChart(process.stdin)
  .then((buffer) => {
    process.stdout.write(buffer)
    process.exitCode = 0
  })
  .catch((error) => {
    if (console) {
      // pretty-print the error
      console.error(error)
    } else {
      process.stderr.write(
        typeof error === 'string' || error instanceof Uint8Array ? error : `${error}`
      )
    }

    process.exitCode = 1
  })
