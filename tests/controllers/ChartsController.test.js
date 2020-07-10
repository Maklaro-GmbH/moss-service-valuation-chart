const chartsController = require('../../src/controllers/ChartsController')
const test_payload = require('../fixtures/test1.json')
const messages = require('../../src/constants/messages')

describe('ChartsController class', function () {
  describe('validateLabelsArray', function () {
    it('should throw invalidType error when labelsArray is not an array', function () {
      const result = () => chartsController.validateLabelsArray({})
      const expectedError = messages.invalidType('data.labels', 'array')
      expect(result).toThrow(expectedError)
    })
    it('should throw arrayRecordOfWrongType error when one of the records is not a string', function () {
      const result = () => chartsController.validateLabelsArray(['03.2020', 5])
      const expected = messages.arrayRecordOfWrongType('data.labels', 'string')
      expect(result).toThrow(expected)
    })
    it('should return true when array has only string records', function () {
      const result = chartsController.validateLabelsArray(['03.2020', '06.2020'])
      expect(result).toBeTruthy()
    })
  })

  describe('validateTicksConfig', function () {
    const ticksConfig = {
      min: 1,
      max: 10,
      maxTicksLimit: 10
    }
    const defaultPath = 'data.datasets[0].yAxis'

    it('should throw an error when not all required params are passed', function () {
      const result = () => chartsController.validateTicksConfig({ min: 1, max: 10 }, defaultPath)
      const expectedErrorRegex = /must contain following fields:/
      expect(result).toThrow(expectedErrorRegex)
    })

    it('should throw an invalidType error when min is not a number', function () {
      const result = () =>
        chartsController.validateTicksConfig({ ...ticksConfig, min: '1' }, defaultPath)
      const expected = messages.invalidType(`${defaultPath}.ticks.min`, 'number')
      expect(result).toThrow(expected)
    })

    it('should throw an invalidType error when max is not a number', function () {
      const result = () =>
        chartsController.validateTicksConfig({ ...ticksConfig, max: '1' }, defaultPath)
      const expected = messages.invalidType(`${defaultPath}.ticks.max`, 'number')
      expect(result).toThrow(expected)
    })

    it('should throw an invalidType error when maxTicksLimit is not a number', function () {
      const result = () =>
        chartsController.validateTicksConfig({ ...ticksConfig, maxTicksLimit: '1' }, defaultPath)
      const expected = messages.invalidType(`${defaultPath}.ticks.maxTicksLimit`, 'number')
      expect(result).toThrow(expected)
    })

    it('should return true when payload is correct', function () {
      const result = chartsController.validateTicksConfig(ticksConfig, defaultPath)
      expect(result).toBeTruthy()
    })
  })

  describe('validateYAxisConfig', function () {
    const axisConfig = {
      position: 'left',
      label: 'Kaufpreis in \u20ac',
      ticks: {
        min: 1,
        max: 10,
        maxTicksLimit: 10
      }
    }
    const defaultPath = 'data.datasets[0]'

    it("should throw an error when not all required params are passed'", function () {
      const result = () => chartsController.validateYAxisConfig({}, defaultPath)
      const expectedErrorRegex = /must contain following fields:/
      expect(result).toThrow(expectedErrorRegex)
    })

    it("should throw an outOfEnumsRange error when position param doesn't match one of the available values'", function () {
      const result = () =>
        chartsController.validateYAxisConfig({ ...axisConfig, position: 'top' }, defaultPath)
      const expectedErrorRegex = /must be oe one of the following values:/
      expect(result).toThrow(expectedErrorRegex)
    })

    it('should throw an invalidType error when label is not a string', function () {
      const result = () =>
        chartsController.validateYAxisConfig({ ...axisConfig, label: 1 }, defaultPath)
      const expectedError = messages.invalidType(`${defaultPath}.yAxis.label`, 'string')
      expect(result).toThrow(expectedError)
    })

    it('should return true when payload is correct', function () {
      const result = chartsController.validateYAxisConfig(axisConfig, defaultPath)
      expect(result).toBeTruthy()
    })
  })

  describe('validateDataset', function () {
    const datasetIndex = 0
    const dataset = test_payload.data.datasets[datasetIndex]

    it("should throw an error when not all required params are passed'", function () {
      const result = () => chartsController.validateDataset({}, datasetIndex)
      const expectedErrorRegex = /must contain following fields:/
      expect(result).toThrow(expectedErrorRegex)
    })

    it('should throw an invalidType error when label is not a string', function () {
      const result = () => chartsController.validateDataset({ ...dataset, label: 1 }, datasetIndex)
      const expectedError = messages.invalidType(`data.datasets[${datasetIndex}].label`, 'string')
      expect(result).toThrow(expectedError)
    })

    it('should return true when payload is correct', function () {
      const result = chartsController.validateDataset(dataset)
      expect(result).toBeTruthy()
    })
  })

  describe('validateStylingObject', function () {
    const stylingObject = test_payload.styling

    it("should throw an error when not all required params are passed'", function () {
      const result = () => chartsController.validateStylingObject({})
      const expectedErrorRegex = /must contain following fields:/
      expect(result).toThrow(expectedErrorRegex)
    })

    it("should throw an outOfEnumsRange error when fontName param doesn't match one of the available values'", function () {
      const result = () =>
        chartsController.validateStylingObject({ ...stylingObject, fontFamily: 'font' })
      const expectedErrorRegex = /must be oe one of the following values:/
      expect(result).toThrow(expectedErrorRegex)
    })

    it('should throw an invalidType error when fontSize is not a number', function () {
      const result = () =>
        chartsController.validateStylingObject({ ...stylingObject, fontSize: 'font' })
      const expectedError = messages.invalidType(`styling.fontSize`, 'number')
      expect(result).toThrow(expectedError)
    })

    it('should throw an invalidType error when fontColor is not a string', function () {
      const result = () =>
        chartsController.validateStylingObject({ ...stylingObject, fontColor: 1 })
      const expectedError = messages.invalidType(`styling.fontColor`, 'string')
      expect(result).toThrow(expectedError)
    })

    it('should return true when payload is correct', function () {
      const result = chartsController.validateStylingObject(stylingObject)
      expect(result).toBeTruthy()
    })
  })

  describe('validatePayload', function () {
    const payload = test_payload

    it("should throw an error when not all required params are passed'", function () {
      const result = () => chartsController.validatePayload({})
      const expectedErrorRegex = /must contain following fields:/
      expect(result).toThrow(expectedErrorRegex)
    })

    it('should return true when payload is correct', function () {
      const result = chartsController.validatePayload(payload)
      expect(result).toBeTruthy()
    })
  })
})
