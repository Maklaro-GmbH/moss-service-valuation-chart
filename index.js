const Chart = require('./src/Chart')

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

module.exports = generateChart
