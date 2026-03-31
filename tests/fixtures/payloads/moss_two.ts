import { DatasetType, Payload } from '../../../src/schemas/payload'
import { join, resolve } from 'path'

export default {
  width: 800,
  height: 250,
  styling: {
    fontPath: resolve(join(__dirname, '..', 'fonts', 'OpenSans-Bold.ttf')),
    fontSize: 12,
    lineColor: '#0d74b6',
    textColor: '#2e2e2e',
    gridColor: '#c0c0c0'
  },
  data: {
    labels: [
      '09.2018',
      '12.2018',
      '03.2019',
      '06.2019',
      '09.2019',
      '12.2019',
      '03.2020',
      '06.2020'
    ],
    datasets: [{
      label: 'Purchase label',
      yAxisLabel: 'Purchase legend',
      type: DatasetType.Purchase,
      data: [
        { date: '09.2018', y: 520000.0 },
        { date: '12.2018', y: 527000.0 },
        { date: '03.2019', y: 523000.0 },
        { date: '06.2019', y: 519000.0 },
        { date: '09.2019', y: 516000.0 },
        { date: '12.2019', y: 523000.0 },
        { date: '03.2020', y: 525000.0 },
        { date: '06.2020', y: 539000.0 }
      ]
    }, {
      label: 'Rent label',
      yAxisLabel: 'Rent legend',
      type: DatasetType.Rental,
      data: [
        { date: '09.2018', y: 7.88 },
        { date: '12.2018', y: 7.92 },
        { date: '03.2019', y: 8.0 },
        { date: '06.2019', y: 8.06 },
        { date: '09.2019', y: 7.97 },
        { date: '12.2019', y: 8.09 },
        { date: '03.2020', y: 8.22 },
        { date: '06.2020', y: 8.37 }
      ]
    }]
  }
} satisfies Payload
