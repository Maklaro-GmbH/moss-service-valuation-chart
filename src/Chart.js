const { CanvasRenderService } = require('chartjs-node-canvas')
const validate = require('jsonschema').validate

const Theme = require('./Theme')
const ticks = require('./plugins/ticks')
const chartGeneratorConfig = require('./config/chartGeneratorConfig')
const datasetBaseProps = require('./config/datasetBaseProps')
const yAxeBaseProps = require('./config/yAxeBaseProps')
const scaleLabelBaseProps = require('./config/scaleLabelBaseProps')
const payloadSchema = require('./schemas/payload')

class Chart {
  constructor(req) {
    this.validateSchema(req)

    this.chartService = this.createChartService(req)
    this.servicePayload = this.formChartServicePayload(req)
  }

  validateSchema(req) {
    const validationResult = validate(req, payloadSchema)
    const hasErrors = !!validationResult.length
    if (hasErrors) {
      throw validationResult
    }
    return true
  }

  createChartService(req) {
    const ChartJS = require('chart.js')
    ChartJS.plugins.register(ticks)
    this.setServiceGlobalDefaults(ChartJS, req.styling)
    this.addChartTheming(ChartJS)
    const chartService = new CanvasRenderService(
      req.width,
      req.height,
      undefined,
      undefined,
      () => ChartJS
    )
    this.registerFont(chartService, req)
    return chartService
  }

  setServiceGlobalDefaults(chartJsInstance, styling) {
    chartJsInstance.defaults.global = {
      ...chartJsInstance.defaults.global,
      defaultFontFamily: 'font-family',
      defaultFontSize: styling.fontSize,
      defaultFontColor: styling.fontColor,
      devicePixelRatio: 2
    }
  }

  addChartTheming(chartJsInstance) {
    const theme = new Theme(chartJsInstance)
    theme.init()
  }

  formChartServicePayload(req) {
    const payload = {
      ...chartGeneratorConfig,
      data: {
        ...req.data,
        datasets: this.transformDatasets(req.data.datasets)
      },
      options: {
        ...chartGeneratorConfig.options,
        scales: {
          ...chartGeneratorConfig.options.scales,
          yAxes: this.formYAxesFromDatasets(req.data.datasets)
        }
      }
    }
    this.setAxesTicks(payload)
    return payload
  }

  formYAxesFromDatasets(datasets) {
    return datasets.map(({ yAxis: { label, ...yAxis } }, index) => ({
      ...yAxis,
      ...yAxeBaseProps,
      scaleLabel: {
        labelString: label,
        ...scaleLabelBaseProps
      },
      id: `y-axis-${index}`
    }))
  }

  transformDatasets(datasets) {
    return datasets.map(({ yAxis, ...dataset }, index) => ({
      ...dataset,
      ...datasetBaseProps,
      yAxisID: `y-axis-${index}`
    }))
  }

  registerFont(canvasService, req) {
    canvasService.registerFont(req.styling.fontPath, { family: 'font-family' })
  }

  async get() {
    const x = await this.chartService.renderToBuffer(this.servicePayload)
    console.log(this.servicePayload)

    return x
  }

  setAxesTicks(payload) {
    payload.options.scales.yAxes.forEach((item) => {
      item.ticks.callback = (value) => {
        if (item.position === 'left') {
          return value
            .toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })
            .replace(/,/g, '.')
        } else {
          if (value % 1 === 0) {
            return value.toString() + ',-'
          } else {
            return value
              .toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
              .replace('.', ',')
          }
        }
      }
    })
  }
}

module.exports = Chart
