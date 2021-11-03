import type { ChartDataset } from 'chart.js'

const value: ChartDataset<'line'> = {
  fill: false,
  borderWidth: 4,
  pointStyle: 'line',
  pointRadius: 0,
  xAxisID: 'x-axis',
  borderCapStyle: 'round',
  borderDash: [0, 10],
  borderDashOffset: 0,
  data: []
}

export default value
