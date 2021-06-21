import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import ChartJS, { ChartConfiguration, Chart, ChartDataset } from 'chart.js'
import { validate } from 'jsonschema'
import { parse as pathParse } from 'path'
import Theme from './Theme'
import makeTicksPlugin from './plugins/ticks'
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

const enabled = false
Chart.register(makeTicksPlugin({ scaleName: 'x-axis' }))

export default class MossChart {
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
    this.setServiceDefaults(ChartJS, req.styling)
    this.addChartTheming(ChartJS)
    const chartService = new ChartJSNodeCanvas({
      width: req.width,
      height: req.height
    })
    this.registerFont(chartService, req)
    return chartService
  }

  private setServiceDefaults(chart: typeof ChartJS, styling: Styling) {
    chart.defaults.font.family = this.getFontFamilyFromPath(styling.fontPath)
    chart.defaults.font.size = styling.fontSize
    chart.defaults.color = styling.textColor
    chart.defaults.devicePixelRatio = 2
  }

  private addChartTheming(chartJsInstance: typeof ChartJS) {
    const enabled = false
    if (enabled) {
      const theme = new Theme(chartJsInstance)
      theme.init()
    }
  }

  formChartServicePayload(req: Payload): ChartConfiguration {
    const objectComputedFromRequest: ChartConfiguration = {
      ...chartGeneratorConfig,
      data: {
        labels: Array.from(req.data.labels),
        datasets: this.transformDatasets(req.data.datasets, req.styling.lineColor)
      },
      options: {
        ...chartGeneratorConfig.options,
        plugins: {
          ...chartGeneratorConfig.options?.plugins,
          legend: {
            ...chartGeneratorConfig.options?.plugins?.legend,
            labels: {
              ...chartGeneratorConfig.options?.plugins?.legend?.labels,
              color: req.styling.textColor
            }
          }
        },
        scales: {
          ...chartGeneratorConfig.options?.scales,
          'x-axis': {
            ...chartGeneratorConfig.options?.scales?.['x-axis'],
            grid: {
              ...chartGeneratorConfig.options?.scales?.['x-axis']?.grid,
              color: req.styling.gridColor
            },
            // @ts-ignore generic union stuff...
            title: {
              // @ts-ignore scale is an union determined by type so `title` may not exists
              ...chartGeneratorConfig.options?.scales?.['x-axis']?.title,
              color: req.styling.textColor
            }
          },
          ...this.setScalesTicks(this.formLinearScalesFromDataSets(req.data.datasets))
        }
      }
    }

    return objectComputedFromRequest
  }

  private formLinearScalesFromDataSets(
    datasets: ReadonlyArray<DataSet>
  ): Required<Required<ChartConfiguration>['options']>['scales'] {
    const valueRanges = {
      purchase: 100000,
      rental: 2
    } as const

    /**
     * @todo replace with `Object.fromEntries` when possible
     */
    return Object.assign(
      {},
      ...datasets.map(
        (
          { yAxisLabel, type, data },
          index
        ): Required<Required<ChartConfiguration>['options']>['scales'] => ({
          [`y-axis-${index}`]: {
            ...this.computeTickRange(data, valueRanges[type]),
            type: 'linear',
            display: true,
            position: index % 2 ? 'right' : 'left',
            beginAtZero: false,
            ticks: {
              maxTicksLimit: 5
            },
            title: {
              display: true,
              text: yAxisLabel
            }
          }
        })
      )
    )
  }

  public computeTickRange(data: ReadonlyArray<DataSetData>, range: number) {
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
    return { min, max } as const
  }

  transformDatasets(
    datasets: ReadonlyArray<DataSet>,
    borderColor: Styling['lineColor']
  ): ChartDataset[] {
    return datasets.map(({ yAxisLabel, type, ...dataset }, index): ChartDataset => {
      const defaultDatasetProps = {
        [DatasetType.Purchase]: purchaseDatasetProps,
        [DatasetType.Rental]: rentalDatasetProps
      } as const
      const typeRelatedAdditionalProps = defaultDatasetProps[type]
      if (!typeRelatedAdditionalProps) throw `Unknown dataset type: ${JSON.stringify(type)}`

      return {
        ...typeRelatedAdditionalProps,
        label: dataset.label,
        data: this.getChartDatasetDataFromChartDatasetData(dataset.data),
        borderColor,
        // @ts-ignore generic type union and stuff...
        yAxisID: `y-axis-${index}`,
        xAxisID: `x-axis`
      }
    })
  }

  private getChartDatasetDataFromChartDatasetData(
    values: ReadonlyArray<DataSetData>
  ): ChartDataset['data'] {
    return values.map((data): ChartDataset['data'][number] => data.y)
  }

  registerFont(canvasService: ChartJSNodeCanvas, { styling: { fontPath } }: Payload) {
    canvasService.registerFont(fontPath, { family: this.getFontFamilyFromPath(fontPath) })
  }

  get(): Promise<Buffer> {
    return this.chartService.renderToBuffer(this.chartServicePayload)
  }

  private setScalesTicks(
    scales: Required<Required<ChartConfiguration>['options']>['scales']
  ): Required<Required<ChartConfiguration>['options']>['scales'] {
    return Object.assign(
      {},
      ...Object.entries(scales).map(
        ([id, scale]): Required<Required<ChartConfiguration>['options']>['scales'] => ({
          [id]: {
            ...scale,
            ticks: {
              ...scale!.ticks,
              callback: (value) => {
                if ((scale as any)!.position === 'left') {
                  return value
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })
                    .replace(/,/g, '.')
                }

                if (typeof value === 'number') {
                  if (value % 1 === 0) {
                    return value.toString() + ',-'
                  }

                  return value
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                    .replace('.', ',')
                }

                return value
              }
            }
          }
        })
      )
    )
  }

  private getFontFamilyFromPath(path: string): string {
    const parsedPath = pathParse(path)

    return parsedPath.name || 'font-family'
  }
}
