import { ChartJSNodeCanvas, MimeType } from 'chartjs-node-canvas'
import ChartJS, {
  ChartConfiguration,
  Chart,
  ChartDataset,
  LegendItem,
  CartesianScaleOptions,
  Scale
} from 'chart.js'
import { validate } from 'jsonschema'
import { parse as pathParse } from 'path'
import makeTicksPlugin from './plugins/ticks'
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
import { overwriteLegendMethods } from './plugins/legend'

overwriteLegendMethods()
Chart.register(makeTicksPlugin({ scaleName: 'x-axis' }))

export default class MossChart {
  private readonly chartService: ChartJSNodeCanvas

  private readonly chartServicePayload: ChartConfiguration

  constructor(req: unknown) {
    this.assertPayloadSchema(req)

    this.chartService = this.createChartService(req)
    this.chartServicePayload = this.formChartServicePayload(req)
  }

  private assertPayloadSchema(req: unknown): asserts req is Payload {
    const validationResult = validate(req, payloadSchema)
    if (!validationResult.valid) {
      throw validationResult.toString()
    }
  }

  private createChartService(req: Payload): ChartJSNodeCanvas {
    this.setServiceDefaults(ChartJS, req.styling)
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

  public formChartServicePayload(req: Payload): ChartConfiguration {
    const datasets = this.transformDatasets(req.data.datasets, req.styling.lineColor)

    const objectComputedFromRequest: ChartConfiguration = {
      type: 'line',
      data: {
        labels: Array.from(req.data.labels),
        datasets
      },
      options: {
        layout: {
          padding: {
            /**
             * when there is only one line/dataset that chart is bounded to the right side of the canvas
             */
            right: req.data.datasets.length === 1 ? 25 : undefined
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'end',
            pointLineLength: 50,
            labels: {
              usePointStyle: true,
              font: {
                size: req.styling.fontSize,
                family: req.styling.fontPath
              },
              color: req.styling.textColor,
              padding: 40,
              generateLabels: () =>
                datasets.map(
                  (dataset, index): LegendItem => ({
                    borderRadius:
                      typeof dataset.pointRadius === 'number' ? dataset.pointRadius : undefined,
                    datasetIndex: dataset.order ?? index,
                    fontColor: req.styling.textColor,
                    lineCap:
                      typeof dataset.borderCapStyle === 'string'
                        ? dataset.borderCapStyle
                        : undefined,
                    lineDash: (Array.isArray as (arg: unknown) => arg is number[])(
                      dataset.borderDash
                    )
                      ? dataset.borderDash
                      : undefined,
                    lineDashOffset:
                      typeof dataset.borderDashOffset === 'number'
                        ? dataset.borderDashOffset
                        : undefined,
                    /**
                     * length of the line is impossible to configure via options
                     * @see https://github.com/chartjs/Chart.js/blob/v3.3.2/src/plugins/plugin.legend.js#L16
                     */
                    lineWidth:
                      typeof dataset.borderWidth === 'number' ? dataset.borderWidth : undefined,
                    pointStyle:
                      typeof dataset.pointStyle === 'string' ? dataset.pointStyle : undefined,
                    strokeStyle:
                      typeof dataset.borderColor === 'string'
                        ? dataset.borderColor
                        : req.styling.lineColor,
                    text: dataset.label ?? '',
                    lineJoin:
                      typeof dataset.borderJoinStyle === 'string'
                        ? dataset.borderJoinStyle
                        : undefined
                  })
                )
            }
          }
        },
        scales: {
          'x-axis': {
            type: 'category',
            display: true,
            position: 'bottom',
            grid: {
              display: false,
              drawBorder: true,
              drawOnChartArea: true,
              tickWidth: 1,
              lineWidth: 1,
              color: req.styling.gridColor,
              tickColor: req.styling.gridColor,
              tickLength: 10
            },
            ticks: {
              display: true,
              maxRotation: 0,
              minRotation: 0,
              padding: 0,
              autoSkip: true,
              includeBounds: false,
              autoSkipPadding: 20,
              major: { enabled: true },
              callback(this: Scale, value, index, { length }) {
                // skip first and last element
                if (index === 0 || index === length - 1) {
                  return undefined
                }

                if (typeof value === 'number') {
                  return this.getLabelForValue(value)
                }

                return value
              }
            },
            title: {
              color: req.styling.textColor
            }
          },
          ...this.setScalesTicks(this.formLinearScalesFromDataSets(req.data.datasets))
        },
        elements: {
          point: {
            radius: 0
          }
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
            offset: true,
            type: 'linear',
            display: true,
            position: index % 2 ? 'right' : 'left',
            beginAtZero: false,
            ticks: {
              maxTicksLimit: 5
            },
            title: {
              display: true,
              text: yAxisLabel,
              align: index % 2 ? 'start' : 'end' // this property does not exists in type definitions
            } as CartesianScaleOptions['title'] & { readonly align?: 'start' | 'center' | 'end' }
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

  private transformDatasets(
    datasets: ReadonlyArray<DataSet>,
    borderColor: Styling['lineColor']
  ): ChartDataset<'line'>[] {
    return datasets.map(({ yAxisLabel, type, ...dataset }, index): ChartDataset<'line'> => {
      const defaultDatasetProps = {
        [DatasetType.Purchase]: purchaseDatasetProps,
        [DatasetType.Rental]: rentalDatasetProps
      } as const
      const typeRelatedAdditionalProps = defaultDatasetProps[type]
      if (!typeRelatedAdditionalProps) throw `Unknown dataset type: ${JSON.stringify(type)}`

      return {
        ...typeRelatedAdditionalProps,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        label: dataset.label,
        data: this.getChartDatasetDataFromChartDatasetData(dataset.data),
        borderColor,
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

  private registerFont(canvasService: ChartJSNodeCanvas, { styling: { fontPath } }: Payload) {
    canvasService.registerFont(fontPath, { family: this.getFontFamilyFromPath(fontPath) })
  }

  /**
   * @returns rendered chart
   */
  public get(mime: MimeType = 'image/png'): Promise<Buffer> {
    return this.chartService.renderToBuffer(this.chartServicePayload, mime)
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
