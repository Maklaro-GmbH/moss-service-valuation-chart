const charts = require("./src/controllers/ChartsController");
const testData = require("./tests/data/test3.json");
const fs = require("fs");

const saveChartBuffer = async (data) => {
  const chartBuffer = await charts.get(data);
  if (Buffer.isBuffer(chartBuffer)) {
    fs.writeFile("resultChart.png", chartBuffer, () => {});
  } else return 1;
};

saveChartBuffer(testData);
