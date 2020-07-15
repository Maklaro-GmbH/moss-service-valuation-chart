#!/usr/bin/env node

const fs = require('fs');
const Chart = require('../src/Chart')

const generateChart = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataParsed = JSON.parse(payload)
      const chart = new Chart(dataParsed)
      const chartBuffer = await chart.get()
      if (Buffer.isBuffer(chartBuffer)) {
        resolve(chartBuffer)
      } else {
        reject(`Error: ${chartBuffer}`)
      }
    } catch (e) {
      reject(e)
    }
  })
}

const jsonAsString = fs.readFileSync("/dev/stdin", "utf-8");

const outputPromise = generateChart(jsonAsString);
outputPromise
    .then(
        (buffer) => {
            process.stdout.write(buffer);
            process.exit(0);
        }
    )
    .catch(
        (error) => {
            process.stderr.write(error);
            process.exit(1);
        }
    );
