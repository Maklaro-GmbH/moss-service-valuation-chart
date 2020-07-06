const Chart = require('../src/Chart')
const oneLinePayload = require('./fixtures/payloads/one_line.json')
const twoLinesPayload = require('./fixtures/payloads/two_lines.json')

describe('Chart.js', function () {
  const chart = new Chart(oneLinePayload)

  describe('formChartServicePayload', function () {
    it('should form expected object for one line chart', function () {
      const expected = require('./expected/one_line_chart')

      const result = chart.formChartServicePayload(oneLinePayload)
      expect(result).toEqual(expected)
    })

    it('should form expected object for two lines chart', function () {
      const expected = require('./expected/two_lines_chart')

      const result = chart.formChartServicePayload(require('./fixtures/payloads/two_lines.json'))
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
