// @ts-nocheck

import { helpers, MajorTickOptions, plugins, TickOptions, Plugin } from 'chart.js'

const { options: helpersOptions } = helpers

const parseFont: (val: unknown) => {
  readonly family: string
  readonly lineHeight: number
  readonly size: number
  readonly style: number
  readonly weight: null
  readonly string: string
} = helpersOptions?._parseFont

function parseFontOptions(options: TickOptions, nestedOpts?: MajorTickOptions) {
  return {
    ...parseFont({
      fontFamily: nestedOpts?.fontFamily ?? options.fontFamily,
      fontSize: nestedOpts?.fontSize ?? options.fontSize,
      fontStyle: nestedOpts?.fontStyle ?? options.fontStyle,
      lineHeight: nestedOpts?.lineHeight ?? options.lineHeight
    }),
    color: nestedOpts?.fontColor ?? options.fontColor
  }
}

function parseTickFontOptions(options: TickOptions) {
  let minor = parseFontOptions(options, options.minor ? options.minor : undefined)
  let major =
    options.major && options.major.enabled ? parseFontOptions(options, options.major) : minor

  return { minor, major } as const
}

const ticks: Plugin = {
  id: 'ticks-plugin',
  beforeDraw(chart: Readonly<Record<any, any>>) {
    // hide original tick
    if (chart.scales['x-axis'] !== undefined) {
      chart.scales['x-axis'].options.ticks.fontColor = 'transparent'
    }
  },
  afterDraw(chart) {
    const { ctx } = chart
    const xAxis = (chart as Readonly<Record<any, any>>).scales['x-axis']

    if (!xAxis || !ctx) {
      return
    }

    // loop through ticks to draw object
    for (const tick of xAxis._ticksToDraw) {
      let xPadding = xAxis.options.ticks.padding || 10
      let xPos = xAxis.getPixelForTick(tick._index) + xPadding / 2
      let yPos = xAxis.top + xPadding * 2

      if (xPos - xPadding * 2 > xAxis.width + xPadding * 2) {
        return
      }

      let fonts = parseTickFontOptions(xAxis.options.ticks)
      let font = tick.major ? fonts.major : fonts.minor

      // draw tick
      ctx.save()
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'left'
      ctx.fillStyle = xAxis.options.scaleLabel.fontColor || font.color
      ctx.font = font.string
      ctx.fillText(tick.label, xPos, yPos)
      ctx.restore()

      let textWidth = ctx.measureText(tick.label).width
      let startXPosLine = xAxis.getPixelForTick(tick._index) + textWidth / 2 + xPadding / 2
      let startYPosLine = xAxis.top - xPadding / 2
      let endXPosLine = xAxis.getPixelForTick(tick._index) + textWidth / 2 + xPadding / 2
      let endYPosLine = xAxis.top + xPadding / 2

      // draw vertical line
      ctx.beginPath()
      ctx.moveTo(startXPosLine, startYPosLine)
      ctx.lineTo(endXPosLine, endYPosLine)
      ctx.lineWidth = xAxis.options.gridLines.lineWidth || 0.5
      ctx.strokeStyle = xAxis.options.gridLines.color
      ctx.lineCap = 'butt'
      ctx.stroke()
      ctx.restore()
    }
  }
}

export default ticks
