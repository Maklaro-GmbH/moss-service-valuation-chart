import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import ChartJS, { ChartConfiguration, ChartDataSets } from 'chart.js'
import { validate } from 'jsonschema'
import { merge } from 'lodash'

import Theme from './Theme'
import ticks from './plugins/ticks'
import chartGeneratorConfig from './config/chartGeneratorConfig'
import purchaseDatasetProps from './config/purchaseDatasetProps'
import rentalDatasetProps from './config/rentalDatasetProps'
import {
  payloadSchema,
  Payload,
  Styling,
  DataSet,
  DataSetData,
  DatasetType
} from './schemas/payload'

export = class Chart {
  readonly chartService: ChartJSNodeCanvas

  readonly chartServicePayload: ChartConfiguration

  constructor(req: unknown) {
    this.assertPayloadSchema(req)

    this.chartService = this.createChartService(req)
    this.chartServicePayload = this.formChartServicePayload(req)
  }

  assertPayloadSchema(req: unknown): asserts req is Payload {
    const validationResult = validate(req, payloadSchema)
    if (!validationResult.valid) {
      throw validationResult.toString()
    }
  }

  createChartService(req: Payload): ChartJSNodeCanvas {
    ChartJS.plugins.register(ticks)
    this.setServiceGlobalDefaults(ChartJS, req.styling)
    this.addChartTheming(ChartJS)
    const chartService = new ChartJSNodeCanvas({
      width: req.width,
      height: req.height,
      // @ts-ignore
      chartCallback: () => ChartJS
    })
    this.registerFont(chartService, req)
    return chartService
  }

  setServiceGlobalDefaults(chartJsInstance: typeof ChartJS, styling: Styling) {
    chartJsInstance.defaults.global = {
      ...chartJsInstance.defaults.global,
      defaultFontFamily: 'font-family',
      defaultFontSize: styling.fontSize,
      defaultFontColor: styling.textColor,
      devicePixelRatio: 2
    }
  }

  addChartTheming(chartJsInstance: typeof ChartJS) {
    const theme = new Theme(chartJsInstance)
    theme.init()
  }

  formChartServicePayload(req: Payload): ChartConfiguration {
    const objectComputedFromRequest = {
      data: {
        labels: req.data.labels as Array<string>,
        datasets: this.transformDatasets(req.data.datasets, req.styling.lineColor)
      },
      options: {
        legend: {
          labels: {
            fontColor: req.styling.textColor
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: { color: req.styling.gridColor },
              scaleLabel: { fontColor: req.styling.textColor }
            }
          ],
          yAxes: this.formYAxesFromDatasets(req.data.datasets)
        }
      }
    }

    this.setAxesTicks(objectComputedFromRequest)

    return merge(chartGeneratorConfig, objectComputedFromRequest)
  }

  formYAxesFromDatasets(datasets: ReadonlyArray<DataSet>) {
    const valueRanges = {
      purchase: 100000,
      rental: 2
    }

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
        ...this.computeTickRange(data, valueRanges[type])
      }
    }))
  }

  computeTickRange(data: ReadonlyArray<DataSetData>, range: number) {
    if (!range) throw 'range must be defined'
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

  transformDatasets(
    datasets: ReadonlyArray<DataSet>,
    borderColor: Styling['lineColor']
  ): ChartDataSets[] {
    return datasets.map(({ yAxisLabel, type, ...dataset }, index): ChartDataSets => {
      const defaultDatasetProps = {
        [DatasetType.Purchase]: purchaseDatasetProps,
        [DatasetType.Rental]: rentalDatasetProps
      } as const
      const typeRelatedAdditionalProps = defaultDatasetProps[type]
      if (!typeRelatedAdditionalProps) throw 'Unknown dataset type'

      return {
        ...typeRelatedAdditionalProps,
        label: dataset.label,
        data: Array.from(dataset.data),
        borderColor,
        yAxisID: `y-axis-${index}`
      }
    })
  }

  registerFont(canvasService: ChartJSNodeCanvas, req: Payload) {
    canvasService.registerFont(req.styling.fontPath, { family: 'font-family' })
  }

  get(): Promise<Buffer> {
    return this.chartService.renderToBuffer(this.chartServicePayload)
  }

  setAxesTicks(payload: ChartConfiguration): void {
    payload.options?.scales?.yAxes?.forEach((item) => {
      ;(item.ticks ??= {}).callback = (value) => {
        if (item.position === 'left') {
          return value
            .toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })
            .replace(/,/g, '.')
        } else {
          if (typeof value === 'number') {
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

          return value
        }
      }
    })
  }
}
