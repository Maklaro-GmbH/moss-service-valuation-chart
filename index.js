const charts = require('./src/controllers/ChartsController')

const generateChart = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataParsed = JSON.parse(payload)
      const chartBuffer = await charts.get(dataParsed)

      if (Buffer.isBuffer(chartBuffer)) resolve(chartBuffer)
      else resolve(`Error: ${chartBuffer}`)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = generateChart
