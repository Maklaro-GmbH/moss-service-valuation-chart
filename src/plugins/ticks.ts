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
  readonly borderDash: readonly unknown[]
  readonly borderDashOffset: number
  readonly tickWidth: number
  readonly tickColor: string
  readonly tickBorderDash: readonly unknown[]
  readonly tickBorderDashOffset: unknown
  readonly tickLength?: number
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
  readonly translation: readonly unknown[]
  readonly backdrop: undefined
}

interface LabelSize {
  readonly first: Readonly<Record<'width' | 'height', number>>
  readonly last: Readonly<Record<'width' | 'height', number>>
  readonly widest: Readonly<Record<'width' | 'height', number>>
  readonly highest: Readonly<Record<'width' | 'height', number>>
  readonly widths: readonly number[]
  readonly heights: readonly number[]
}

interface AfterDrawScale extends Scale<CartesianScaleOptions> {
  readonly _gridLineItems: readonly GridLineItem[]
  readonly _labelItems: readonly LabelItem[]
  readonly _labelSizes: LabelSize
}

export default function makeTicksPlugin ({ scaleName }: { readonly scaleName: string }): Plugin {
  return {
    id: 'ticks-plugin',
    afterDraw (chart) {
      const scale = chart.scales[scaleName] as AfterDrawScale | undefined

      if (scale == null) {
        throw new Error(`chart scale named ${JSON.stringify(scaleName)} does not exists`)
      }

      const { ctx } = scale

      for (let index = 0; index < scale._labelItems.length; index++) {
        const gridLine = scale._gridLineItems[index]
        const height = gridLine.tickLength ?? scale._labelSizes.heights[index]

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
    }
  }
}
