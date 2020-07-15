const { CanvasRenderService } = require('chartjs-node-canvas')
const ChartJS = require('chart.js')
const validate = require('jsonschema').validate
const { merge } = require('lodash')

const Theme = require('./Theme')
const ticks = require('./plugins/ticks')
const chartGeneratorConfig = require('./config/chartGeneratorConfig')
const purchaseDatasetProps = require('./config/purchaseDatasetProps')
const rentalDatasetProps = require('./config/rentalDatasetProps')
const payloadSchema = require('./schemas/payload')

class Chart {
  constructor(req) {
    this.assertPayloadSchema(req)

    this.chartService = this.createChartService(req)
    this.chartServicePayload = this.formChartServicePayload(req)
  }

  assertPayloadSchema(req) {
    const validationResult = validate(req, payloadSchema)
    if (!validationResult.valid) {
      throw validationResult.toString()
    }
  }

  createChartService(req) {
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
    const objectComputedFromPayload = {
      data: {
        labels: req.data.labels,
        datasets: this.transformDatasets(req.data.datasets, req.styling.lineColor)
      },
      options: {
        legend: {
          labels: {
            fontColor: req.styling.fontColor
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: { color: req.styling.gridColor },
              scaleLabel: { fontColor: req.styling.fontColor }
            }
          ],
          yAxes: this.formYAxesFromDatasets(req.data.datasets)
        }
      }
    }
    this.setAxesTicks(objectComputedFromPayload)

    return merge(chartGeneratorConfig, objectComputedFromPayload)
  }

  formYAxesFromDatasets(datasets) {
    const purchaseValuesRange = 100000
    const rentalValuesRange = 2

    return datasets.map(({ yAxisLabel, type, data }, index) => ({
      display: true,
      color: 'rgba(150, 150, 150, 1)',
      type: 'linear',
      id: `y-axis-${index}`,
      position: index % 2 ? 'right' : 'left',
      scaleLabel: {
        labelString: yAxisLabel,
        display: true,
        align: 'end'
      },
      ticks: {
        beginAtZero: false,
        maxTicksLimit: 5,
        ...this.computeTickRange(
          data,
          type === 'purchase' ? purchaseValuesRange : rentalValuesRange
        )
      }
    }))
  }

  computeTickRange(data, range) {
    const values = data.map(({ y }) => y)
    let max = Math.ceil(Math.max(...values) / range) * range
    let min = Math.ceil(Math.min(...values) / -range) * -range
    if (Math.min(...values) >= max) {
      max += range
    }
    if (Math.min(...values) <= min) {
      min -= range
    }
    return { min, max }
  }

  transformDatasets(datasets, borderColor) {
    return datasets.map(({ yAxisLabel, type, ...dataset }, index) => {
      const typeRelatedAdditionalProps =
        type === 'purchase' ? purchaseDatasetProps : rentalDatasetProps

      return {
        ...typeRelatedAdditionalProps,
        label: dataset.label,
        data: dataset.data,
        borderColor,
        yAxisID: `y-axis-${index}`
      }
    })
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
