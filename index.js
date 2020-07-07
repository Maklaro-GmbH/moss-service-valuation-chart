const charts = require('./src/controllers/ChartsController');
const testData = require("./tests/data/test3.json");
const fs = require("fs");


const saveChartBuffer = async data => {
    const chartBuffer = await charts.get(data);
    if (Buffer.isBuffer(chartBuffer)) {
       fs.writeFile("resultChart.png", chartBuffer, () => {})
    }
}


// const args = process.argv.slice(2);
// return charts.get(testData).then(chartImage => chartImage);
saveChartBuffer(testData);