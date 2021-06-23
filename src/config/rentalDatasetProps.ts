import type { ChartDataset } from 'chart.js'

export default {
  fill: false,
  borderWidth: 4,
  pointStyle: 'line',
  pointRadius: 0,
  xAxisID: 'x-axis',
  lineTension: 0,
  borderCapStyle: 'round',
  borderDash: [0, 10],
  /**
   * @see https://www.chartjs.org/docs/2.9.4/charts/line.html#line-styling
   */
  borderDashOffset: [0, 5] as unknown as number,
  data: [],
  bezierCurve: false
} as ChartDataset<'line'>
