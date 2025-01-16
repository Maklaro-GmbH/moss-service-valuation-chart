import { ChartJSNodeCanvas, MimeType } from 'chartjs-node-canvas'
import ChartJS, {
  ChartConfiguration,
  Chart,
  ChartDataset,
  LegendItem,
  Scale
} from 'chart.js'
import { validate } from 'jsonschema'
import { parse as pathParse } from 'path'
import makeTicksPlugin from './plugins/ticks'
import { overwriteLegendMethods } from './plugins/legend'
import purchaseDatasetProps from './config/purchaseDatasetProps'
import rentalDatasetProps from './config/rentalDatasetProps'
import {
  payloadSchema,
  Payload,
  Styling,
  PayloadDataset,
  DataSetData,
  DatasetType
} from './schemas/payload'

overwriteLegendMethods()
Chart.register(makeTicksPlugin({ scaleName: 'x-axis' }))

export default class MossChart {
  private readonly chartService: ChartJSNodeCanvas

  private readonly chartServicePayload: ChartConfiguration

  /**
   * @param payload raw payload, passed value is validated internally
   * @throws when provided {@link payload} is invalid
   */
  constructor (payload: unknown) {
    this.assertPayloadSchema(payload)

    this.chartService = this.createChartService(payload)
    this.chartServicePayload = this.formChartServicePayload(payload)
  }

  private assertPayloadSchema (req: unknown): asserts req is Payload {
    validate(req, payloadSchema, { throwAll: true })
  }

  private createChartService (req: Payload): ChartJSNodeCanvas {
    this.setServiceDefaults(ChartJS, req.styling)

    const chartService = new ChartJSNodeCanvas({
      width: req.width,
      height: req.height
    })

    this.registerFont(chartService, req)

    return chartService
  }

  /**
   * @fixme `chart.defaults.font` is not a {@link ChartJS.Scriptable},
   * introduced in {@link https://github.com/chartjs/Chart.js/pull/9680},
   * let's hope it'll get fixed in a future release
   *
   * @see https://github.com/chartjs/Chart.js/blob/v3.6.0/docs/general/fonts.md
   */
  private setServiceDefaults (chart: typeof ChartJS, styling: Styling): void {
    (chart.defaults.font as ChartJS.FontSpec).family = this.getFontFamilyFromPath(styling.fontPath);
    (chart.defaults.font as ChartJS.FontSpec).size = styling.fontSize
    chart.defaults.color = styling.textColor
    chart.defaults.devicePixelRatio = 2
  }

  public formChartServicePayload (req: Payload): ChartConfiguration {
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
                     * {@link overwriteLegendMethods}
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
              callback (this: Scale, value, index, { length }) {
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
          ...this.formLinearScalesFromDataSets(req.data.datasets)
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

  private formLinearScalesFromDataSets (
    datasets: readonly PayloadDataset[]
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
        ): Required<Required<ChartConfiguration>['options']>['scales'] => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          const position = index % 2 ? 'right' : 'left'
          return {
            [`y-axis-${index}`]: {
              ...this.computeTickRange(data, valueRanges[type]),
              offset: false,
              type: 'linear',
              display: true,
              position,
              beginAtZero: false,
              ticks: {
                maxTicksLimit: 5,
                callback: (value) => {
                  if (position === 'left') {
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
              },
              title: {
                display: true,
                text: yAxisLabel,
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                align: index % 2 ? 'start' : 'end'
              }
            }
          }
        }
      )
    )
  }

  public computeTickRange (data: readonly DataSetData[], range: number): {
    readonly min: number
    readonly max: number
  } {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-throw-literal
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

  /**
   * transforms the payload dataset into chart datasets (y axis values)
   */
  private transformDatasets (
    datasets: readonly PayloadDataset[],
    borderColor: Styling['lineColor']
  ): Array<ChartDataset<'line'>> {
    return datasets.map(({ yAxisLabel, type, ...dataset }, index): ChartDataset<'line'> => {
      const defaultDatasetProps = {
        [DatasetType.Purchase]: purchaseDatasetProps,
        [DatasetType.Rental]: rentalDatasetProps
      } as const
      const typeRelatedAdditionalProps = defaultDatasetProps[type]
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-throw-literal
      if (!typeRelatedAdditionalProps) throw `Unknown dataset type: ${JSON.stringify(type)}`

      return {
        ...typeRelatedAdditionalProps,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        label: dataset.label,
        data: dataset.data.map((data) => data.y),
        borderColor,
        yAxisID: `y-axis-${index}`,
        xAxisID: 'x-axis'
      }
    })
  }

  /**
   * registers the payload's font in provided chart canvas
   */
  private registerFont (canvasService: ChartJSNodeCanvas, { styling: { fontPath } }: Payload): void {
    canvasService.registerFont(fontPath, { family: this.getFontFamilyFromPath(fontPath) })
  }

  /**
   * @returns rendered chart
   */
  public async get (mime: MimeType = 'image/png'): Promise<Buffer> {
    return await this.chartService.renderToBuffer(this.chartServicePayload, mime)
  }

  private getFontFamilyFromPath (path: string): string {
    const { name } = pathParse(path)

    return name.length > 0 ? name : 'font-family'
  }
}
