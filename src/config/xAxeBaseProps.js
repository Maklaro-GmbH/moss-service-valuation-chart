const xAxeBaseProps = {
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
    zeroLineColor: 'rgba(150, 150, 150, 1)',
    color: 'rgba(150, 150, 150, 1)'
  },
  ticks: {
    maxTicksLimit: 8,
    maxRotation: 0,
    minRotation: 0,
    padding: 0
  }
}

module.exports = xAxeBaseProps
