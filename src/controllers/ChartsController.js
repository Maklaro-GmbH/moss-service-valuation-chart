const ChartsService = require('../Charts')
const fontsList = require('../fonts/index')
const messages = require('../constants/messages')
const typeCheckers = require('../utils/typeCheckers')

class ChartsController {
  get(req) {
    try {
      this.validatePayload(req)
      const chart = new ChartsService(req)

      return chart
        .get()
        .then((data) => data)
        .catch(console.error)
    } catch (error) {
      return error
    }
  }

  validateLabelsArray(labelsArray) {
    if (!typeCheckers.isArray(labelsArray)) throw messages.invalidType('data.labels', 'array')
    if (labelsArray.some((label) => !typeCheckers.isString(label)))
      throw messages.arrayRecordOfWrongType('data.labels', 'string')
  }

  validateTicksConfig(ticksConfig, containingAxisPath) {
    const REQUIRED_CONFIG_PARAMS = ['maxTicksLimit', 'min', 'max']
    const ticksConfigPath = `${containingAxisPath}.ticks`

    typeCheckers.checkRequiredParamsArePassed(ticksConfig, REQUIRED_CONFIG_PARAMS, ticksConfigPath)
    if (!typeCheckers.isNumber(ticksConfig.maxTicksLimit))
      throw messages.invalidType(`${ticksConfigPath}.maxTicksLimit`, 'number')
    if (!typeCheckers.isNumber(ticksConfig.min))
      throw messages.invalidType(`${ticksConfigPath}.min`, 'number')
    if (!typeCheckers.isNumber(ticksConfig.max))
      throw messages.invalidType(`${ticksConfigPath}.max`, 'number')
  }

  validateYAxisConfig(yAxisConfig, containingDatasetPath) {
    const REQUIRED_CONFIG_PARAMS = ['position', 'label', 'ticks']
    const Y_AXIS_POSITION_ENUMS = ['left', 'right']
    const axisPath = `${containingDatasetPath}.yAxis`

    typeCheckers.checkRequiredParamsArePassed(yAxisConfig, REQUIRED_CONFIG_PARAMS, axisPath)
    if (!typeCheckers.isInEnumsRange(yAxisConfig.position, Y_AXIS_POSITION_ENUMS))
      throw messages.outOfEnumsRange(axisPath, Y_AXIS_POSITION_ENUMS)
    if (!typeCheckers.isString(yAxisConfig.label))
      throw messages.invalidType(`${axisPath}.label`, 'string')
    this.validateTicksConfig(yAxisConfig.ticks, axisPath)
  }

  validateDataset(datasetObject, index) {
    const REQUIRED_DATASET_PARAMS = ['label', 'data', 'yAxis']
    const datasetPath = `data.datasets[${index}]`
    typeCheckers.checkRequiredParamsArePassed(datasetObject, REQUIRED_DATASET_PARAMS, datasetPath)
    if (!typeCheckers.isString(datasetObject.label))
      throw messages.invalidType(`${datasetPath}.label`)
    this.validateYAxisConfig(datasetObject.yAxis, datasetPath)
  }

  validateDatasetsArray(datasetsArray) {
    if (!typeCheckers.isArray(datasetsArray)) throw messages.invalidType('data.datasets', 'array')
    datasetsArray.forEach((dataset, index) => this.validateDataset(dataset, index))
  }

  validateDataObject(dataObject) {
    const REQUIRED_DATA_PARAMS = ['labels', 'datasets']
    typeCheckers.checkRequiredParamsArePassed(dataObject, REQUIRED_DATA_PARAMS, 'data')

    this.validateLabelsArray(dataObject.labels)
    this.validateDatasetsArray(dataObject.datasets)
  }

  validateStylingObject(stylingObject) {
    const REQUIRED_STYLING_PARAMS = ['fontFamily', 'fontSize', 'fontColor']
    typeCheckers.checkRequiredParamsArePassed(stylingObject, REQUIRED_STYLING_PARAMS, 'styling')
    if (!fontsList.some(({ fontName }) => stylingObject.fontFamily === fontName))
      throw messages.outOfEnumsRange(
        'styling.fontFamily',
        fontsList.map(({ fontName }) => fontName)
      )
    if (!typeCheckers.isNumber(stylingObject.fontSize))
      throw messages.invalidType('styling.fontSize', 'number')
    if (!typeCheckers.isString(stylingObject.fontColor))
      throw messages.invalidType('styling.fontColor', 'string')
  }

  validatePayload(payload) {
    const REQUIRED_PAYLOAD_PARAMS = ['width', 'height', 'styling', 'data']
    typeCheckers.checkRequiredParamsArePassed(payload, REQUIRED_PAYLOAD_PARAMS, 'payload')
    if (!typeCheckers.isNumber(payload.width)) throw messages.invalidType('width', 'number')
    if (!typeCheckers.isNumber(payload.height)) throw messages.invalidType('height', 'number')
    this.validateStylingObject(payload.styling)
    this.validateDataObject(payload.data)
  }
}

module.exports = new ChartsController()
