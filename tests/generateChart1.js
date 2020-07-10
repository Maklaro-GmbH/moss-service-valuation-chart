const fs = require('fs')

const charts = require('../src/controllers/ChartsController')
const testData = require('./data/test1.json')

const saveChartBuffer = async (data) => {
  const chartBuffer = await charts.get(data)
  if (Buffer.isBuffer(chartBuffer)) {
    fs.writeFile('./result/test1.png', chartBuffer, () => {})
  }
}

return saveChartBuffer(testData)
