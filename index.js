const Chart = require('./src/Chart')

const generateChart = (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataParsed = JSON.parse(payload)
      const chartBuffer = await new Chart(dataParsed).get()

      if (Buffer.isBuffer(chartBuffer)) {
        resolve(chartBuffer)
        return
      }

      reject(`Error: ${chartBuffer}`)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = generateChart
