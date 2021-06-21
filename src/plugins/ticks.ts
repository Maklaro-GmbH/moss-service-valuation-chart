import type { CartesianScaleOptions, Plugin, Scale, TextAlign, FontSpec } from 'chart.js'

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
  readonly borderDash: ReadonlyArray<unknown>
  readonly borderDashOffset: number
  readonly tickWidth: number
  readonly tickColor: number
  readonly tickBorderDash: ReadonlyArray<unknown>
  readonly tickBorderDashOffset: unknown
}

interface LabelItem {
  readonly rotation: number
  readonly label: number
  readonly font: FontSpec & { readonly string: string }
  readonly color: string
  readonly strokeColor: string
  readonly strokeWidth: number
  readonly textOffset: number
  readonly textAlign: TextAlign
  readonly textBaseline: CanvasTextBaseline
  readonly translation: ReadonlyArray<unknown>
  readonly backdrop: undefined
}

interface LabelSize {
  readonly first: Readonly<Record<'width' | 'height', number>>
  readonly last: Readonly<Record<'width' | 'height', number>>
  readonly widest: Readonly<Record<'width' | 'height', number>>
  readonly highest: Readonly<Record<'width' | 'height', number>>
  readonly widths: ReadonlyArray<number>
  readonly heights: ReadonlyArray<number>
}

interface AfterDrawScale extends Scale<CartesianScaleOptions> {
  readonly _gridLineItems: ReadonlyArray<GridLineItem>
  readonly _labelItems: ReadonlyArray<LabelItem>
  readonly _labelSizes: LabelSize
}

function normalizeTickLabel(value: string | ReadonlyArray<string> | undefined | null): string {
  if (typeof value === 'undefined' || value === null) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return value.join('')
}

export default function makeTicksPlugin({ scaleName }: { readonly scaleName: string }): Plugin {
  return {
    id: 'ticks-plugin',
    beforeDraw(chart, args, options) {
      const scale = chart.scales[scaleName] as Scale<CartesianScaleOptions> | undefined

      if (!scale) {
        throw new Error(`chart scale named ${JSON.stringify(scaleName)} does not exists`)
      }

      // set color to transparent to hide the ticks to be drawn
      // scale.options.ticks.color = 'transparent'
    },
    afterDraw(chart) {
      const scale = chart.scales[scaleName] as AfterDrawScale | undefined

      if (!scale) {
        throw new Error(`chart scale named ${JSON.stringify(scaleName)} does not exists`)
      }

      const { ctx } = scale

      for (let index = 0; index < scale._labelItems.length; index++) {
        const gridLine = scale._gridLineItems[index]
        const labelItem = scale._labelItems[index]
        const width = scale._labelSizes.widths[index]
        const height = scale._labelSizes.heights[index]

        // draw vertical tick line
        ctx.beginPath()
        ctx.moveTo(gridLine.x2, gridLine.y2 - height / 2)
        ctx.lineTo(gridLine.x2, gridLine.y2 + height / 2)
        ctx.lineWidth = gridLine.width
        ctx.strokeStyle = gridLine.color
        ctx.lineCap = 'butt'
        ctx.stroke()
        ctx.restore()
      }

      for (const tick of scale.ticks) {
        const tickLabel = normalizeTickLabel(tick.label)
      }
    }
  }
}
