/**
 * disable eslint in this file to make future updates easier by leaving the code as is
 */
/* eslint-disable */
import {
  Legend as LegendPlugin,
  Element,
  LegendOptions,
  LegendItem,
  Chart,
  ChartEvent,
  defaults,
  // @ts-ignore no type defs
  helpers,
  ChartType,
} from 'chart.js'

declare module 'chart.js' {
  interface LegendOptions<TType extends ChartType> {
    /**
     * custom property
     *
     * specify what length should the point line have, working only when `usePintStyle` is used
     */
    pointLineLength?: number
  }
}

/**
 * the internal `chart.js` Label class
 */
// @ts-expect-error `Element.prototype` does not accept generics
declare class Legend extends Element<{}, LegendOptions<ChartType>> {
  constructor(config: LegendOptions<ChartType>)
  _added: false
  legendHitBoxes: { left: number; top: number; row: number; width: number; height: number }[]
  _hoveredItem: null
  doughnutMode: false
  chart: Chart
  options: LegendOptions<ChartType>
  ctx: CanvasRenderingContext2D
  legendItems?: LegendItem[]
  columnSizes?: { height: number; width: number }[]
  lineWidths?: number[]
  maxHeight?: number
  maxWidth?: number
  top?: number
  bottom?: number
  left?: number
  right?: number
  height?: number
  width?: number
  _margins?: unknown
  position: undefined
  weight: undefined
  fullSize: undefined
  update(maxWidth: this['maxWidth'], maxHeight: this['maxHeight'], margins: this['_margins']): void
  setDimensions(): void
  buildLabels(): void
  fit(): void
  _fitRows(titleHeight: number, fontSize: number, boxWidth: number, itemHeight: number): number
  _fitCols(titleHeight: number, fontSize: number, boxWidth: number, itemHeight: number): number
  adjustHitBoxes(): void
  isHorizontal(): boolean
  draw(): void
  _draw(): void
  drawTitle(): void
  _computeTitleHeight(): number
  _getLegendItemAt(x: number, y: number): LegendItem | null
  handleEvent(e: ChartEvent): void
}

const PrivateLegend = (LegendPlugin as unknown as { readonly _element: typeof Legend })._element

const originalPrivateDrawMethod = PrivateLegend.prototype._draw
const originalPrivateFitMethod = PrivateLegend.prototype.fit

export function overwriteLegendMethods() {
  const {
    valueOrDefault,
    toFont,
    getRtlAdapter,
    overrideTextDirection,
    restoreTextDirection,
    toTRBLCorners,
    addRoundedRectPath,
    drawPoint,
    renderText,
    _alignStartEnd,
    _textX
  } = helpers

  function getBoxSize(
    labelOpts: LegendOptions<ChartType>['labels'],
    fontSize: number,
    pointLineLength: LegendOptions<ChartType>['pointLineLength']
  ) {
    let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts

    if (labelOpts.usePointStyle) {
      boxWidth =
        typeof pointLineLength === 'number' ? pointLineLength : Math.min(boxWidth, fontSize)
      boxHeight = Math.min(boxHeight, fontSize)
    }

    return {
      boxWidth,
      boxHeight,
      itemHeight: Math.max(fontSize, boxHeight)
    }
  }

  /**
   * the internal `fit` mthod with some changes regarding drawing point lines
   */
  PrivateLegend.prototype.fit = function fit(this: Legend) {
    const { options, ctx } = this

    // The legend may not be displayed for a variety of reasons including
    // the fact that the defaults got set to `false`.
    // When the legend is not displayed, there are no guarantees that the options
    // are correctly formatted so we need to bail out as early as possible.
    if (!options.display) {
      this.width = this.height = 0
      return
    }

    const labelOpts = options.labels
    const labelFont = toFont(labelOpts.font)
    const fontSize = labelFont.size
    const titleHeight = this._computeTitleHeight()
    const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize, this.options.pointLineLength)

    let width: number
    let height: number

    ctx.font = labelFont.string

    if (this.isHorizontal()) {
      width = this.maxWidth! // fill all the width
      height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10
    } else {
      height = this.maxHeight! // fill all the height
      width = this._fitCols(titleHeight, fontSize, boxWidth, itemHeight) + 10
    }

    this.width = Math.min(width, options.maxWidth || this.maxWidth!)
    this.height = Math.min(height, options.maxHeight || this.maxHeight!)
  }

  /**
   * the internal `_draw` mthod with some changes regarding drawing point lines
   */
  PrivateLegend.prototype._draw = function _draw() {
    const { options: opts, columnSizes, lineWidths, ctx } = this
    const { align, labels: labelOpts } = opts
    const defaultColor = defaults.color
    const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width)
    const labelFont = toFont(labelOpts.font)
    const { color: fontColor, padding } = labelOpts
    const fontSize = labelFont.size
    const halfFontSize = fontSize / 2
    let cursor: { x: number; y: number; line: number }

    this.drawTitle()

    // Canvas setup
    ctx.textAlign = rtlHelper.textAlign('left')
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 0.5
    ctx.font = labelFont.string

    const { boxWidth, boxHeight, itemHeight } = getBoxSize(
      labelOpts,
      fontSize,
      opts.pointLineLength
    )

    // current position
    const drawLegendBox = (x: number, y: number, legendItem: LegendItem) => {
      if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
        return
      }

      // Set the ctx for the box
      ctx.save()

      const lineWidth = valueOrDefault(legendItem.lineWidth, 1)
      ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor)
      ctx.lineCap = valueOrDefault(legendItem.lineCap, 'butt')
      ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0)
      ctx.lineJoin = valueOrDefault(legendItem.lineJoin, 'miter')
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor)

      ctx.setLineDash(valueOrDefault(legendItem.lineDash, []))

      if (labelOpts.usePointStyle) {
        // Recalculate x and y for drawPoint() because its expecting
        // x and y to be center of figure (instead of top left)
        const drawOptions = {
          radius: (boxWidth * Math.SQRT2) / 2,
          pointStyle: legendItem.pointStyle,
          rotation: legendItem.rotation,
          borderWidth: lineWidth
        }
        const centerX = rtlHelper.xPlus(x, boxWidth / 2)
        const centerY = y + halfFontSize

        // Draw pointStyle as legend symbol
        drawPoint(ctx, drawOptions, centerX, centerY)
      } else {
        // Draw box as legend symbol
        // Adjust position when boxHeight < fontSize (want it centered)
        const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0)
        const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth)
        const borderRadius = toTRBLCorners(legendItem.borderRadius)

        ctx.beginPath()

        if (Object.values(borderRadius).some((v) => v !== 0)) {
          addRoundedRectPath(ctx, {
            x: xBoxLeft,
            y: yBoxTop,
            w: boxWidth,
            h: boxHeight,
            radius: borderRadius
          })
        } else {
          ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight)
        }

        ctx.fill()
        if (lineWidth !== 0) {
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    const fillText = (x: number, y: number, legendItem: LegendItem) => {
      renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
        strikethrough: legendItem.hidden,
        textAlign: rtlHelper.textAlign(legendItem.textAlign)
      })
    }

    // Horizontal
    const isHorizontal = this.isHorizontal()
    const titleHeight = this._computeTitleHeight()
    if (isHorizontal) {
      cursor = {
        x: _alignStartEnd(align, this.left! + padding, this.right! - lineWidths![0]),
        y: this.top! + padding + titleHeight,
        line: 0
      }
    } else {
      cursor = {
        x: this.left! + padding,
        y: _alignStartEnd(
          align,
          this.top! + titleHeight + padding,
          this.bottom! - columnSizes![0].height
        ),
        line: 0
      }
    }

    overrideTextDirection(this.ctx, opts.textDirection)

    const lineHeight = itemHeight + padding
    this.legendItems!.forEach((legendItem, i) => {
      // TODO: Remove fallbacks at v4
      ctx.strokeStyle = legendItem.fontColor || fontColor // for strikethrough effect
      ctx.fillStyle = legendItem.fontColor || fontColor // render in correct colour

      const textWidth = ctx.measureText(legendItem.text).width
      const textAlign = rtlHelper.textAlign(
        legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign)
      )
      const width = boxWidth + halfFontSize + textWidth
      let x = cursor.x
      let y = cursor.y

      rtlHelper.setWidth(this.width)

      if (isHorizontal) {
        if (i > 0 && x + width + padding > this.right!) {
          y = cursor.y += lineHeight
          cursor.line++
          x = cursor.x = _alignStartEnd(
            align,
            this.left! + padding,
            this.right! - lineWidths![cursor.line]
          )
        }
      } else if (i > 0 && y + lineHeight > this.bottom!) {
        x = cursor.x = x + columnSizes![cursor.line].width + padding
        cursor.line++
        y = cursor.y = _alignStartEnd(
          align,
          this.top! + titleHeight + padding,
          this.bottom! - columnSizes![cursor.line].height
        )
      }

      const realX =
        rtlHelper.x(x) -
        (typeof this.options.pointLineLength === 'number' ? this.options.pointLineLength / 4 : 0)

      drawLegendBox(realX, y, legendItem)

      x = _textX(
        textAlign,
        x + boxWidth + halfFontSize,
        isHorizontal ? x + width : this.right,
        opts.rtl
      )

      // Fill the actual label
      fillText(rtlHelper.x(x), y, legendItem)

      if (isHorizontal) {
        cursor.x += width + padding
      } else {
        cursor.y += lineHeight
      }
    })

    restoreTextDirection(this.ctx, opts.textDirection)
  }
}

export function restoreDefaultLegendMethods() {
  PrivateLegend.prototype.fit = originalPrivateFitMethod
  PrivateLegend.prototype._draw = originalPrivateDrawMethod
}
