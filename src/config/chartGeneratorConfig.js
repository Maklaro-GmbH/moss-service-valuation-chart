const xAxeBaseProps = require('./xAxeBaseProps')

const chartGeneratorConfig = {
  type: 'line',
  options: {
    legend: {
      display: true,
      position: 'bottom',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 50,
        padding: 10,
        paddingRight: 0,
        fontColor: 'rgba(0, 0, 0, 1)'
      }
    },
    scales: {
      xAxes: [xAxeBaseProps]
    },
    elements: {
      point: {
        radius: 0
      }
    }
  }
}

module.exports = chartGeneratorConfig
