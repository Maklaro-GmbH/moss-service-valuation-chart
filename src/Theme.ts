import type { default as ChartJS, ChartLegendItem, ChartDataSets, PointStyle } from 'chart.js'

export default class Theme {
  /**
   * @param chart the `chart.js` v2 module
   */
  constructor(private readonly chart: typeof ChartJS) {}

  public init() {
    this.axesTitles()
    this.legendLabels()
    this.legendFixLinesStyle()
  }

  private axesTitles() {
    const { helpers: helpers$1, defaults: core_defaults } = this.chart

    ;(this.chart as any).Scale.prototype._drawTitle = function _drawTitle(this: any) {
      const me = this
      const ctx = me.ctx
      const options = me.options
      const scaleLabel = options.scaleLabel
      const align = scaleLabel.align || 'center'
      const textWidth = ctx.measureText(scaleLabel.labelString).width

      if (!scaleLabel.display) {
        return
      }

      const scaleLabelFontColor = scaleLabel.fontColor ?? core_defaults.global.defaultFontColor
      const scaleLabelFont = helpers$1.options._parseFont(scaleLabel)
      const scaleLabelPadding = helpers$1.options.toPadding(scaleLabel.padding)
      const halfLineHeight = scaleLabelFont.lineHeight / 2
      const position = options.position
      let rotation = 0
      let scaleLabelX
      let scaleLabelY

      if (me.isHorizontal()) {
        switch (align) {
          case 'start':
            scaleLabelX = me.left
            break
          case 'end':
            scaleLabelX = me.left + me.width - textWidth
            break
          default:
            // center/middle
            scaleLabelX = me.left + me.width / 2
            break
        }
        // scaleLabelX = me.left + me.width / 2
        scaleLabelY =
          position === 'bottom'
            ? me.bottom - halfLineHeight - scaleLabelPadding.bottom
            : me.top + halfLineHeight + scaleLabelPadding.top
      } else {
        let isLeft = position === 'left'
        switch (align) {
          case 'start':
            scaleLabelY = isLeft
              ? me.top + me.height - textWidth / 2 + scaleLabelPadding.top
              : me.top + textWidth / 2 - scaleLabelPadding.bottom
            break
          case 'end':
            scaleLabelY = isLeft
              ? me.top + textWidth / 2 - scaleLabelPadding.top
              : me.top + me.height - textWidth / 2 + scaleLabelPadding.bottom
            break
          default:
            // center/middle
            scaleLabelY = me.top + me.height / 2
            break
        }

        scaleLabelX = isLeft
          ? me.left + halfLineHeight + scaleLabelPadding.top
          : me.right - halfLineHeight - scaleLabelPadding.top
        // scaleLabelY = me.top + me.height / 2;
        rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI
      }

      ctx.save()
      ctx.translate(scaleLabelX, scaleLabelY)
      ctx.rotate(rotation)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = scaleLabelFontColor // render in correct colour
      ctx.font = scaleLabelFont.string
      ctx.fillText(scaleLabel.labelString, 0, 0)
      ctx.restore()
    }
  }

  private legendFixLinesStyle() {
    const originalAfterFit = (this.chart as any).Legend.prototype.afterFit
    ;(this.chart as any).Legend.prototype.afterFit = function (this: any) {
      originalAfterFit.apply(this, arguments as any)

      // fix style
      let datasets = this.chart.config.data.datasets as ReadonlyArray<ChartDataSets>
      if (datasets && datasets.length) {
        ;(this.chart.legend.legendItems as ReadonlyArray<ChartLegendItem>).forEach((item, i) => {
          const correspondingDataSet = datasets[i] as ChartDataSets | undefined
          if (correspondingDataSet) {
            if (item.lineDash === undefined && correspondingDataSet.borderDash !== undefined) {
              item.lineDash = correspondingDataSet.borderDash
            }
            if (
              item.lineDashOffset === undefined &&
              correspondingDataSet.borderDashOffset !== undefined
            ) {
              item.lineDashOffset = correspondingDataSet.borderDashOffset
            }
            if (item.lineCap === undefined && correspondingDataSet.borderCapStyle !== undefined) {
              item.lineCap = correspondingDataSet.borderCapStyle
            }
            if (item.pointStyle === undefined && correspondingDataSet.pointStyle !== undefined) {
              item.pointStyle = correspondingDataSet.pointStyle as PointStyle | undefined
            }
          }
        })
      }
    }
  }

  private legendLabels() {
    const {
      helpers: helpers,
      helpers: {
        rtl: { getRtlAdapter: getRtlAdapter },
      },
      defaults: core_defaults
    } = this.chart

    function getBoxWidth({ boxWidth }: { readonly boxWidth: number }) {
      return boxWidth
    }

    ;(this.chart as any).Legend.prototype.draw = function draw(this: any) {
      const me = this
      const {
        options: opts,
        options: {
          labels: labelOpts,
          labels: { paddingLeft: labelPaddingLeft = 0, paddingRight: labelPaddingRight = 0 }
        },
        width: legendWidth,
        lineWidths: lineWidths
      } = this
      const {
        global: { defaultColor, elements: { line: lineDefault = {} } = {}, defaultFontColor }
      } = core_defaults

      if (!opts.display || !me.isHorizontal()) {
        return
      }

      const rtlHelper = getRtlAdapter(opts.rtl, me.left, me.minSize.width)
      const ctx = me.ctx as CanvasRenderingContext2D
      const fontColor = labelOpts.fontColor ?? defaultFontColor
      const labelFont = helpers.options._parseFont(labelOpts)
      const fontSize = labelFont.size
      let cursor: {
        x: number
        y: number
        line: number
      }

      // Canvas setup
      ctx.textAlign = rtlHelper.textAlign('left')
      ctx.textBaseline = 'middle'
      ctx.lineWidth = 0.5
      ctx.strokeStyle = fontColor // for strikethrough effect
      ctx.fillStyle = fontColor // render in correct colour
      ctx.font = labelFont.string

      const boxWidth = getBoxWidth(labelOpts)
      const hitboxes = me.legendHitBoxes

      // update line widths (all legend labels width + boxes)
      ;(me.legendItems as ChartLegendItem[]).forEach((item, i) => {
        let width = boxWidth * Math.SQRT2 + fontSize + ctx.measureText(item.text!).width

        if (
          i === 0 ||
          lineWidths[lineWidths.length - 1] + width + 2 * labelOpts.padding > me.minSize.width
        ) {
          // totalHeight += fontSize + labelOpts.padding;
          lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0
        }

        hitboxes[i].width = width
        lineWidths[lineWidths.length - 1] += width + labelOpts.padding / 2
      })

      // current position
      const drawLegendBox = (x: number, y: number, legendItem: ChartLegendItem): void => {
        if (isNaN(boxWidth) || boxWidth <= 0) {
          return
        }

        // Set the ctx for the box
        ctx.save()

        const lineWidth = legendItem.lineWidth ?? lineDefault.borderWidth
        ctx.fillStyle = legendItem.fillStyle ?? (defaultColor as string)
        ctx.lineCap = legendItem.lineCap ?? (lineDefault.borderCapStyle as CanvasLineCap)
        ctx.lineDashOffset = legendItem.lineDashOffset ?? (lineDefault.borderDashOffset as number)
        ctx.lineJoin = legendItem.lineJoin ?? (lineDefault.borderJoinStyle as CanvasLineJoin)
        ctx.lineWidth = lineWidth as number
        ctx.strokeStyle = legendItem.strokeStyle ?? (defaultColor as string)

        if (ctx.setLineDash) {
          // IE 9 and 10 do not support line dash
          ctx.setLineDash(legendItem.lineDash ?? (lineDefault.borderDash as number[]))
        }

        if (labelOpts && labelOpts.usePointStyle) {
          // Recalculate x and y for drawPoint() because its expecting
          // x and y to be center of figure (instead of top left)
          let radius = (boxWidth * Math.SQRT2) / 2
          let centerX = rtlHelper.xPlus(x, boxWidth / 2)
          let centerY = y + fontSize / 2

          // Draw pointStyle as legend symbol
          helpers.canvas.drawPoint(
            ctx,
            legendItem.pointStyle,
            radius,
            centerX,
            centerY,
            // @ts-expect-error unknown property
            legendItem.rotation
          )
        } else {
          // Draw box as legend symbol
          ctx.fillRect(rtlHelper.leftForLtr(x, boxWidth), y, boxWidth, fontSize)
          if (lineWidth !== 0) {
            ctx.strokeRect(rtlHelper.leftForLtr(x, boxWidth), y, boxWidth, fontSize)
          }
        }

        ctx.restore()
      }

      const fillText = (
        x: number,
        y: number,
        legendItem: ChartLegendItem,
        textWidth: number
      ): void => {
        let halfFontSize = fontSize / 2
        let xLeft = rtlHelper.xPlus(x, boxWidth + halfFontSize)
        let yMiddle = y + halfFontSize

        ctx.fillText(legendItem.text!, xLeft, yMiddle)

        if (legendItem.hidden) {
          // Strikethrough the text if hidden
          ctx.beginPath()
          ctx.lineWidth = 2
          ctx.moveTo(xLeft, yMiddle)
          ctx.lineTo(rtlHelper.xPlus(xLeft, textWidth), yMiddle)
          ctx.stroke()
        }
      }

      const alignmentOffset = (dimension: number, blockSize: number): number => {
        switch (opts.align) {
          case 'start':
            return labelOpts.padding + labelPaddingLeft
          case 'end':
            const offset = dimension - blockSize - labelPaddingRight - boxWidth * Math.SQRT2
            return offset < 0 ? 0 : offset
          default:
            // center
            return (dimension - blockSize + labelOpts.padding) / 2
        }
      }

      cursor = {
        x: me.left + alignmentOffset(legendWidth, lineWidths[0]),
        y: me.top + labelOpts.padding,
        line: 0
      }

      helpers.rtl.overrideTextDirection(me.ctx, opts.textDirection)

      const itemHeight = fontSize + labelOpts.padding * 2
      ;(me.legendItems as ReadonlyArray<ChartLegendItem>).forEach((legendItem, i) => {
        const textWidth = ctx.measureText(legendItem.text!).width
        const width = boxWidth + fontSize / 2 + textWidth
        let { x, y } = cursor

        rtlHelper.setWidth(me.minSize.width)

        // Use (me.left + me.minSize.width) and (me.top + me.minSize.height)
        // instead of me.right and me.bottom because me.width and me.height
        // may have been changed since me.minSize was calculated
        if (
          i > 0 &&
          x + width + labelOpts.padding + labelPaddingLeft > me.left + me.minSize.width
        ) {
          y = cursor.y += itemHeight
          cursor.line++
          x = cursor.x = me.left + alignmentOffset(legendWidth, lineWidths[cursor.line])
        }

        let realX = rtlHelper.x(x) + (boxWidth * Math.SQRT2) / 2

        drawLegendBox(realX, y, legendItem)

        realX += 10

        hitboxes[i].left = rtlHelper.leftForLtr(realX, hitboxes[i].width)
        hitboxes[i].top = y

        // Fill the actual label
        fillText(realX, y, legendItem, textWidth)
        cursor.x += width + labelOpts.padding + boxWidth * Math.SQRT2
      })

      helpers.rtl.restoreTextDirection(me.ctx, opts.textDirection)
    }
  }
}
