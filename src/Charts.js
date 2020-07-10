const { CanvasRenderService } = require('chartjs-node-canvas')
const Theme = require('./Theme')
const ticks = require('./plugins/ticks')
const chartGeneratorConfig = require('./config/chartGeneratorConfig')
const datasetBaseProps = require('./config/datasetBaseProps')
const yAxeBaseProps = require('./config/yAxeBaseProps')
const scaleLabelBaseProps = require('./config/scaleLabelBaseProps')

class Charts {
  constructor(req) {
    this.width = req.width
    this.height = req.height
    this.global = this.formGlobal(req)
    this.config = this.formConfig(req)

    this.setAxesTicks()
    this.setCanvasService()
    this.registerFont(req)
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

  registerFont(req) {
    this.canvasService.registerFont(req.styling.fontFamily, { family: 'font-family' })
  }

  setCanvasService() {
    if (!this.canvasService) {
      this.canvasService = new CanvasRenderService(
        this.width,
        this.height,
        undefined,
        undefined,
        () => {
          let ChartJS = require('chart.js')

          ChartJS.defaults.global.devicePixelRatio = 2
          ChartJS.plugins.register(ticks)

          if (this.global) {
            for (let i in this.global) {
              ChartJS.defaults.global[i] = this.global[i]
            }
          }

          let theme = new Theme(ChartJS)
          theme.init()

          delete require.cache[require.resolve('chart.js')]
          return ChartJS
        }
      )
    }
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
