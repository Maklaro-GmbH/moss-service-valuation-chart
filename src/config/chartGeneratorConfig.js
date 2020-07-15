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
        paddingRight: 0
      }
    },
    scales: {
      xAxes: [
        {
          id: 'x-axis',
          display: true,
          position: 'bottom',
          scaleLabel: {
            display: true
          },
          gridLines: {
            display: false,
            drawBorder: false,
            drawOnChartArea: false,
            lineWidth: 1,
            tickMarkLength: 10,
            zeroLineWidth: 1,
            zeroLineColor: 'rgba(150, 150, 150, 1)'
          },
          ticks: {
            maxTicksLimit: 8,
            maxRotation: 0,
            minRotation: 0,
            padding: 0
          }
        }
      ]
    },
    elements: {
      point: {
        radius: 0
      }
    }
  }
}

module.exports = chartGeneratorConfig
