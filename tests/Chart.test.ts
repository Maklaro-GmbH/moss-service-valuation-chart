import Chart from '../src/Chart'
import type { Payload } from '../src/schemas/payload'
import oneLinePayload from './fixtures/payloads/one_line.json'
import twoLinesPayload from './fixtures/payloads/two_lines.json'

describe(Chart, () => {
  const chart = new Chart(oneLinePayload)

  describe('computeTickRange', function () {
    const { data } = twoLinesPayload.data.datasets[0]

    it('should throw an error when range is not defined', function () {
      // @ts-expect-error
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
