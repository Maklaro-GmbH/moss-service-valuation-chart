const { CanvasRenderService } = require('chartjs-node-canvas')
const validate = require('jsonschema').validate
const ChartJS = require('chart.js')

const Theme = require('./Theme')
const ticks = require('./plugins/ticks')
const chartGeneratorConfig = require('./config/chartGeneratorConfig')
const datasetBaseProps = require('./config/datasetBaseProps')
const yAxeBaseProps = require('./config/yAxeBaseProps')
const scaleLabelBaseProps = require('./config/scaleLabelBaseProps')
const payloadSchema = require('./schemas/payload')

class Charts {
  constructor(req) {
    this.validateSchema(req)

    ChartJS.plugins.register(ticks)

    this.setServiceGlobalDefaults(ChartJS, req.styling)
    this.addChartTheming(ChartJS)

    this.global = this.formGlobal(req)
    this.config = this.formConfig(req)

    this.setCanvasService()
  }

  validateSchema(req) {
    const validationResult = validate(req, payloadSchema)
    const hasErrors = !!validationResult.length
    if (hasErrors) {
      throw validationResult
    }
    return true
  }

  setServiceGlobalDefaults(chartJsInstance, config) {
    chartJsInstance.defaults.global = {
      ...chartJsInstance.defaults.global,
      ...config,
      devicePixelRatio: 2
    }
  }

  addChartTheming(chartJsInstance) {
    const theme = new Theme(chartJsInstance)
    theme.init()
  }

  formConfig(req) {
    return {
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
  }

  formGlobal({ styling }) {
    return {
      defaultFontFamily: 'font-family',
      defaultFontSize: styling.fontSize,
      defaultFontColor: styling.fontColor
    }
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

  setCanvasService(chartJsInstance, req) {
    const canvasService = new CanvasRenderService(
      req.width,
      req.height,
      undefined,
      undefined,
      () => chartJsInstance
    )
    this.registerFont(canvasService, req)
    this.setAxesTicks(req, canvasService)
  }

  get() {
    return this.canvasService.renderToBuffer(this.config)
  }

  setAxesTicks() {
    if (
      this.config.options &&
      this.config.options.scales !== undefined &&
      this.config.options.scales.yAxes !== undefined &&
      this.config.options.scales.yAxes.length
    ) {
      this.config.options.scales.yAxes.map((item) => {
        if (item.ticks !== undefined) {
          if (item.id === 'left-y-axis') {
            item.ticks.callback = (value) => {
              return value
                .toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })
                .replace(/,/g, '.')
            }
          }

          if (item.id === 'right-y-axis') {
            item.ticks.callback = (value) => {
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
        }
      })
    }
  }
}

module.exports = Charts
