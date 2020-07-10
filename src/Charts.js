const { CanvasRenderService } = require('chartjs-node-canvas')
const Theme = require('./Theme')
const ticks = require('./plugins/ticks')
const chartGeneratorConfig = require('./config/chartGeneratorConfig')
const datasetBaseProps = require('./config/datasetBaseProps')
const yAxeBaseProps = require('./config/yAxeBaseProps')
const scaleLabelBaseProps = require('./config/scaleLabelBaseProps')
const fontsList = require('./fonts/index')

class Charts {
  constructor(req) {
    this.width = req.width
    this.height = req.height
    this.global = this.formGlobal(req)
    this.config = this.formConfig(req)

    this.setAxesTicks()
    this.setCanvasService()
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
      defaultFontFamily: styling.fontFamily,
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

  registerFonts() {
    fontsList.forEach((font) => {
      const fontPath = `${__dirname}/./fonts/${font.fontFileName}`
      this.canvasService.registerFont(fontPath, { family: font.fontName })
    })
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

      this.registerFonts()
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
