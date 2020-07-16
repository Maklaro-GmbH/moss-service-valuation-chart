const Chart = require('../src/Chart')
const oneLinePayload = require('./fixtures/payloads/one_line.json')
const twoLinesPayload = require('./fixtures/payloads/two_lines.json')

// jest.mock('../src/Chart', () => {
//   return jest.fn().mockImplementation(() => {
//     return { setAxesTicks: jest.fn() }
//   })
// })

describe('Chart.js', function () {
  const chart = new Chart(oneLinePayload)

  describe('formChartServicePayload', function () {
    it('should form expected object for one line chart', function () {
      const expected = {
        data: {
          datasets: [
            {
              borderColor: '#c40caa',
              borderWidth: 4,
              data: [
                {
                  date: '09.2012',
                  y: 442000
                },
                {
                  date: '12.2012',
                  y: 461000
                },
                {
                  date: '03.2013',
                  y: 473000
                },
                {
                  date: '06.2013',
                  y: 481000
                },
                {
                  date: '09.2013',
                  y: 477000
                },
                {
                  date: '12.2013',
                  y: 487000
                },
                {
                  date: '03.2014',
                  y: 503000
                },
                {
                  date: '06.2014',
                  y: 508000
                },
                {
                  date: '09.2014',
                  y: 511000
                },
                {
                  date: '12.2014',
                  y: 519000
                },
                {
                  date: '03.2015',
                  y: 540000
                },
                {
                  date: '06.2015',
                  y: 534000
                },
                {
                  date: '09.2015',
                  y: 540000
                },
                {
                  date: '12.2015',
                  y: 561000
                },
                {
                  date: '03.2016',
                  y: 566000
                },
                {
                  date: '06.2016',
                  y: 570000
                },
                {
                  date: '09.2016',
                  y: 579000
                },
                {
                  date: '12.2016',
                  y: 595000
                },
                {
                  date: '03.2017',
                  y: 599000
                },
                {
                  date: '06.2017',
                  y: 606000
                },
                {
                  date: '09.2017',
                  y: 604000
                },
                {
                  date: '12.2017',
                  y: 616000
                },
                {
                  date: '03.2018',
                  y: 637000
                },
                {
                  date: '06.2018',
                  y: 636000
                },
                {
                  date: '09.2018',
                  y: 649000
                },
                {
                  date: '12.2018',
                  y: 661000
                },
                {
                  date: '03.2019',
                  y: 673000
                },
                {
                  date: '06.2019',
                  y: 680000
                },
                {
                  date: '09.2019',
                  y: 720000
                },
                {
                  date: '12.2019',
                  y: 725000
                },
                {
                  date: '03.2020',
                  y: 728000
                }
              ],
              fill: false,
              label: 'Kaufpreisentwicklung',
              pointRadius: 0,
              pointStyle: 'line',
              xAxisID: 'x-axis',
              yAxisID: 'y-axis-0'
            }
          ],
          labels: [
            '09.2012',
            '12.2012',
            '03.2013',
            '06.2013',
            '09.2013',
            '12.2013',
            '03.2014',
            '06.2014',
            '09.2014',
            '12.2014',
            '03.2015',
            '06.2015',
            '09.2015',
            '12.2015',
            '03.2016',
            '06.2016',
            '09.2016',
            '12.2016',
            '03.2017',
            '06.2017',
            '09.2017',
            '12.2017',
            '03.2018',
            '06.2018',
            '09.2018',
            '12.2018',
            '03.2019',
            '06.2019',
            '09.2019',
            '12.2019',
            '03.2020'
          ]
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          legend: {
            align: 'end',
            display: true,
            labels: {
              boxWidth: 50,
              fontColor: '#666',
              padding: 10,
              paddingRight: 0,
              usePointStyle: true
            },
            position: 'bottom'
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  color: '#000',
                  display: false,
                  drawBorder: false,
                  drawOnChartArea: false,
                  lineWidth: 1,
                  tickMarkLength: 10
                },
                id: 'x-axis',
                position: 'bottom',
                scaleLabel: {
                  display: true,
                  fontColor: '#666'
                },
                ticks: {
                  maxRotation: 0,
                  maxTicksLimit: 8,
                  minRotation: 0,
                  padding: 0
                }
              }
            ],
            yAxes: [
              {
                color: 'rgba(150, 150, 150, 1)',
                display: true,
                id: 'y-axis-0',
                position: 'left',
                scaleLabel: {
                  align: 'end',
                  display: true,
                  labelString: 'Kaufpreis in €'
                },
                ticks: {
                  beginAtZero: false,
                  callback: expect.any(Function),
                  max: 800000,
                  maxTicksLimit: 5,
                  min: 400000
                },
                type: 'linear'
              }
            ]
          }
        },
        type: 'line'
      }

      const result = chart.formChartServicePayload(oneLinePayload)
      expect(result).toEqual(expected)
    })

    it('should form expected object for two lines chart', function () {
      const expected = {
        data: {
          datasets: [
            {
              borderColor: '#0e74b6',
              borderWidth: 4,
              data: [
                {
                  date: '06.2018',
                  y: 636000
                },
                {
                  date: '09.2018',
                  y: 649000
                },
                {
                  date: '12.2018',
                  y: 661000
                },
                {
                  date: '03.2019',
                  y: 673000
                },
                {
                  date: '06.2019',
                  y: 680000
                },
                {
                  date: '09.2019',
                  y: 720000
                },
                {
                  date: '12.2019',
                  y: 725000
                },
                {
                  date: '03.2020',
                  y: 728000
                },
                {
                  date: '09.2014',
                  y: 511000
                },
                {
                  date: '12.2014',
                  y: 519000
                },
                {
                  date: '03.2015',
                  y: 540000
                },
                {
                  date: '06.2015',
                  y: 534000
                },
                {
                  date: '09.2015',
                  y: 540000
                },
                {
                  date: '12.2015',
                  y: 561000
                },
                {
                  date: '03.2016',
                  y: 566000
                },
                {
                  date: '06.2016',
                  y: 570000
                },
                {
                  date: '09.2016',
                  y: 579000
                },
                {
                  date: '12.2016',
                  y: 595000
                },
                {
                  date: '03.2017',
                  y: 599000
                },
                {
                  date: '06.2017',
                  y: 606000
                },
                {
                  date: '09.2017',
                  y: 604000
                },
                {
                  date: '12.2017',
                  y: 616000
                },
                {
                  date: '03.2018',
                  y: 637000
                },
                {
                  date: '06.2018',
                  y: 636000
                },
                {
                  date: '09.2018',
                  y: 649000
                },
                {
                  date: '12.2018',
                  y: 661000
                },
                {
                  date: '03.2019',
                  y: 673000
                },
                {
                  date: '06.2019',
                  y: 680000
                },
                {
                  date: '09.2019',
                  y: 720000
                },
                {
                  date: '12.2019',
                  y: 725000
                },
                {
                  date: '03.2020',
                  y: 728000
                }
              ],
              fill: false,
              label: 'Kaufpreisentwicklung',
              pointRadius: 0,
              pointStyle: 'line',
              xAxisID: 'x-axis',
              yAxisID: 'y-axis-0'
            },
            {
              bezierCurve: false,
              borderCapStyle: 'round',
              borderColor: '#0e74b6',
              borderDash: [0, 10],
              borderDashOffset: [0, 5],
              borderWidth: 4,
              data: [
                {
                  date: '06.2018',
                  y: 3.73
                },
                {
                  date: '09.2018',
                  y: 4.13
                },
                {
                  date: '12.2018',
                  y: 4.17
                },
                {
                  date: '03.2019',
                  y: 4.2
                },
                {
                  date: '06.2019',
                  y: 4.33
                },
                {
                  date: '09.2019',
                  y: 4.3
                },
                {
                  date: '12.2019',
                  y: 4.44
                }
              ],
              fill: false,
              label: 'Mietpreisentwicklung',
              lineTension: 0,
              pointRadius: 0,
              pointStyle: 'line',
              xAxisID: 'x-axis',
              yAxisID: 'y-axis-1'
            }
          ],
          labels: [
            '06.2018',
            '09.2018',
            '12.2018',
            '03.2019',
            '06.2019',
            '09.2019',
            '12.2019',
            '03.2020',
            '09.2014',
            '12.2014',
            '03.2015',
            '06.2015',
            '09.2015',
            '12.2015',
            '03.2016',
            '06.2016',
            '09.2016',
            '12.2016',
            '03.2017',
            '06.2017',
            '09.2017',
            '12.2017',
            '03.2018',
            '06.2018',
            '09.2018',
            '12.2018',
            '03.2019',
            '06.2019',
            '09.2019',
            '12.2019',
            '03.2020'
          ]
        },
        options: {
          elements: {
            point: {
              radius: 0
            }
          },
          legend: {
            align: 'end',
            display: true,
            labels: {
              boxWidth: 50,
              fontColor: '#000',
              padding: 10,
              paddingRight: 0,
              usePointStyle: true
            },
            position: 'bottom'
          },
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  color: '#000',
                  display: false,
                  drawBorder: false,
                  drawOnChartArea: false,
                  lineWidth: 1,
                  tickMarkLength: 10
                },
                id: 'x-axis',
                position: 'bottom',
                scaleLabel: {
                  display: true,
                  fontColor: '#000'
                },
                ticks: {
                  maxRotation: 0,
                  maxTicksLimit: 8,
                  minRotation: 0,
                  padding: 0
                }
              }
            ],
            yAxes: [
              {
                color: 'rgba(150, 150, 150, 1)',
                display: true,
                id: 'y-axis-0',
                position: 'left',
                scaleLabel: {
                  align: 'end',
                  display: true,
                  labelString: 'Kaufpreis in €'
                },
                ticks: {
                  beginAtZero: false,
                  callback: expect.any(Function),
                  max: 800000,
                  maxTicksLimit: 5,
                  min: 600000
                },
                type: 'linear'
              },
              {
                color: 'rgba(150, 150, 150, 1)',
                display: true,
                id: 'y-axis-1',
                position: 'right',
                scaleLabel: {
                  align: 'end',
                  display: true,
                  labelString: 'Mietpreis pro m² in €'
                },
                ticks: {
                  beginAtZero: false,
                  callback: expect.any(Function),
                  max: 6,
                  maxTicksLimit: 5,
                  min: 2
                },
                type: 'linear'
              }
            ]
          }
        },
        type: 'line'
      }

      const result = chart.formChartServicePayload(twoLinesPayload)
      expect(result).toEqual(expected)
    })
  })

  describe('computeTickRange', function () {
    const { data } = twoLinesPayload.data.datasets[0]

    it('should throw an error when range is not defined', function () {
      const result = () => chart.computeTickRange(data)
      expect(result).toThrow('range must be defined')
    })

    it('should return max value being first number divisible by 100000 greater than biggest number in the array', function () {
      const result = chart.computeTickRange(data, 100000)
      const expected = 800000
      expect(result.max).toEqual(expected)
    })

    it('should return min value being first number divisible by 100000 smaller than smallest number in the array', function () {
      const result = chart.computeTickRange(data, 100000)
      const expected = 600000
      expect(result.min).toEqual(expected)
    })
  })
})
