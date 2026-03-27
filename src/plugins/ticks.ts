import type {
  Plugin
} from 'chart.js'

export default function makeTicksPlugin (
  { scaleName }: { readonly scaleName: string }
): Plugin {
  return {
    id: 'ticks-plugin',
    afterDraw (chart) {
      const scale = chart.scales[scaleName]

      if (scale == null) {
        throw new Error(
          `chart scale named ${JSON.stringify(scaleName)} does not exists`
        )
      }

      const { ctx } = scale

      const labelItems = scale.getLabelItems()

      for (let index = 0; index < labelItems.length; index++) {
        // @ts-expect-error
        const gridLine = scale._gridLineItems[index]
        // @ts-expect-error
        const height = gridLine.tickLength as number ?? scale._labelSizes.heights[index] as number

        // draw vertical tick line
        ctx.beginPath()
        ctx.moveTo(gridLine.x2, gridLine.y2 as number - height / 2)
        ctx.lineTo(gridLine.x2, gridLine.y2 as number + height / 2)
        ctx.lineWidth = gridLine.tickWidth
        ctx.strokeStyle = gridLine.tickColor
        ctx.lineCap = 'butt'
        ctx.stroke()
        ctx.restore()
      }
    }
  }
}
