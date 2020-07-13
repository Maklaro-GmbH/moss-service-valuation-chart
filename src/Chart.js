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
    if (this.validateSchema(req)) {
      this.chartService = this.createChartService(req)
      this.chartServicePayload = this.formChartServicePayload(req)
    }
  }

  formValidationErrorMessage(errorsArray) {
    return errorsArray.map(({ property, message }) => `'${property}' ${message}`).join(', ')
  }

  validateSchema(req) {
    const validationResult = validate(req, payloadSchema)
    const hasErrors = !!validationResult.errors.length
    if (hasErrors) {
      throw this.formValidationErrorMessage(validationResult.errors)
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
        datasets: this.transformDatasets(req.data.datasets, req.styling.lineColor)
      },
      options: {
        ...chartGeneratorConfig.options,
        legend: {
          ...chartGeneratorConfig.options.legend,
          labels: {
            ...chartGeneratorConfig.options.legend.labels,
            fontColor: req.styling.fontColor
          }
        },
        scales: {
          xAxes: this.formXAxesFromDatasets(req.styling),
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

  formXAxesFromDatasets(styling) {
    return chartGeneratorConfig.options.scales.xAxes.map((axis) => ({
      ...axis,
      gridLines: { ...axis.gridLines, color: styling.gridColor },
      scaleLabel: { ...axis.scaleLabel, fontColor: styling.fontColor }
    }))
  }

  transformDatasets(datasets, borderColor) {
    return datasets.map(({ yAxis, ...dataset }, index) => ({
      ...dataset,
      ...datasetBaseProps,
      borderColor,
      yAxisID: `y-axis-${index}`
    }))
  }

  registerFont(canvasService, req) {
    canvasService.registerFont(req.styling.fontPath, { family: 'font-family' })
  }

  get() {
    return this.chartService.renderToBuffer(this.chartServicePayload)
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
