const charts = require("./src/controllers/ChartsController");
const testData = require("./tests/data/test3.json");
const fs = require("fs");

const saveChartBuffer = async (data) => {
  try {
    const chartBuffer = await charts.get(data);
    if (Buffer.isBuffer(chartBuffer)) {
      fs.writeFile("./tests/result/test3.png", chartBuffer, () => {});
      return 0;
    }
    return 1;
  } catch {
    return 1;
  }
};

return saveChartBuffer(testData);
