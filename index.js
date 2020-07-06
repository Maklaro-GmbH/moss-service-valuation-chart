const charts = require('./src/controllers/ChartsController');
const testData = require("./tests/data/test1.json");

const args = process.argv.slice(2);
return charts.get(testData).then(chartImage => chartImage);
