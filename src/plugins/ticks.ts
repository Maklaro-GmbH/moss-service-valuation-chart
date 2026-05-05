import type { Plugin, Scale } from 'chart.js'

interface GridLineItem {
  readonly tx1: number
  readonly ty1: number
  readonly tx2: number
  readonly ty2: number
  readonly x1: number
  readonly y1: number
  readonly x2: number
  readonly y2: number
  readonly width: number
  readonly color: string
  readonly borderDash: readonly number[]
  readonly borderDashOffset: number
  readonly tickWidth: number
  readonly tickColor: string
  readonly tickBorderDash: readonly number[]
  readonly tickBorderDashOffset: number
  readonly tickLength?: number
}

interface LabelSizeItem {
  readonly width: number
  readonly height: number
}

interface LabelSizes {
  readonly first: LabelSizeItem
  readonly last: LabelSizeItem
  readonly widest: LabelSizeItem
  readonly highest: LabelSizeItem
  readonly widths: readonly number[]
  readonly heights: readonly number[]
}

interface InternalScale extends Scale {
  readonly _gridLineItems: readonly GridLineItem[]
  _getLabelSizes(): LabelSizes
}

/**
 * This plugin uses some knowledge gained from reading the Chart.js source code.
 * Especially the `core.scale.js` file, good luck upgrading it.
 * Technically tick is a part of the grid line, but it can't be drawn when the grid lines are disabled.
 * @see {@link https://github.com/chartjs/Chart.js/blob/9c5cf9fac7ec04a71b516e2aff3f7d76876be369/src/core/core.scale.js core.scale.js}
 */
export function makeTicksPlugin({
  scaleName,
}: {
  readonly scaleName: string
}): Plugin {
  return {
    id: 'ticks-plugin',
    afterDraw(chart) {
      const scale = chart.scales[scaleName] as InternalScale | null | undefined

      if (!scale) {
        throw new Error(
          `chart scale named ${JSON.stringify(scaleName)} does not exists`,
        )
      }

      const { ctx } = scale

      const gridLineItems = scale._gridLineItems
      const labelSizes = scale._getLabelSizes()

      for (let index = 0; index < gridLineItems.length; index++) {
        const gridLine = gridLineItems[index]
        const height = gridLine.tickLength ?? labelSizes.highest.height

        // draw vertical tick line
        ctx.beginPath()
        ctx.moveTo(gridLine.x2, gridLine.y2 - height / 2)
        ctx.lineTo(gridLine.x2, gridLine.y2 + height / 2)
        ctx.lineWidth = gridLine.tickWidth
        ctx.strokeStyle = gridLine.tickColor
        ctx.lineCap = 'butt'
        ctx.stroke()
        ctx.restore()
      }
    },
  }
}
