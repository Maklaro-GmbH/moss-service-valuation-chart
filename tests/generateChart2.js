const fs = require('fs')

const charts = require('../src/controllers/ChartsController')
const testData = require('../tests/data/test2.json')

const saveChartBuffer = async (data) => {
  const chartBuffer = await charts.get(data)
  if (Buffer.isBuffer(chartBuffer)) {
    fs.writeFile('./result/test2.png', chartBuffer, () => {})
  }
}

return saveChartBuffer(testData)
