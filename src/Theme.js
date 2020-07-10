class Theme {
  constructor(ChartJS) {
    this.chart = ChartJS;
  }

  init() {
    this.axesTitles();
    this.legendLabels();
    this.legendFixLinesStyle();
  }

  axesTitles() {
    let helpers$1 = this.chart.helpers;
    let chartInstance = this.chart;
    let core_defaults = chartInstance.defaults;
    let valueOrDefault$a = helpers$1.valueOrDefault;

    let originalDrawTitle = this.chart.Scale.prototype._drawTitle;
    this.chart.Scale.prototype._drawTitle = function () {
      let me = this;
      let ctx = me.ctx;
      let options = me.options;
      let scaleLabel = options.scaleLabel;
      let align = scaleLabel.align || "center";
      let textWidth = ctx.measureText(scaleLabel.labelString).width;

      if (!scaleLabel.display) {
        return;
      }

      let scaleLabelFontColor = valueOrDefault$a(
        scaleLabel.fontColor,
        core_defaults.global.defaultFontColor
      );
      let scaleLabelFont = helpers$1.options._parseFont(scaleLabel);
      let scaleLabelPadding = helpers$1.options.toPadding(scaleLabel.padding);
      let halfLineHeight = scaleLabelFont.lineHeight / 2;
      let position = options.position;
      let rotation = 0;
      let scaleLabelX, scaleLabelY;

      if (me.isHorizontal()) {
        switch (align) {
          case "start":
            scaleLabelX = me.left;
            break;
          case "end":
            scaleLabelX = me.left + me.width - textWidth;
            break;
          default:
            // center/middle
            scaleLabelX = me.left + me.width / 2;
            break;
        }
        // scaleLabelX = me.left + me.width / 2
        scaleLabelY =
          position === "bottom"
            ? me.bottom - halfLineHeight - scaleLabelPadding.bottom
            : me.top + halfLineHeight + scaleLabelPadding.top;
      } else {
        let isLeft = position === "left";
        switch (align) {
          case "start":
            scaleLabelY = isLeft
              ? me.top + me.height - textWidth / 2 + scaleLabelPadding.top
              : me.top + textWidth / 2 - scaleLabelPadding.bottom;
            break;
          case "end":
            scaleLabelY = isLeft
              ? me.top + textWidth / 2 - scaleLabelPadding.top
              : me.top + me.height - textWidth / 2 + scaleLabelPadding.bottom;
            break;
          default:
            // center/middle
            scaleLabelY = me.top + me.height / 2;
            break;
        }

        scaleLabelX = isLeft
          ? me.left + halfLineHeight + scaleLabelPadding.top
          : me.right - halfLineHeight - scaleLabelPadding.top;
        // scaleLabelY = me.top + me.height / 2;
        rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
      }

      ctx.save();
      ctx.translate(scaleLabelX, scaleLabelY);
      ctx.rotate(rotation);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = scaleLabelFontColor; // render in correct colour
      ctx.font = scaleLabelFont.string;
      ctx.fillText(scaleLabel.labelString, 0, 0);
      ctx.restore();
    };
  }

  legendFixLinesStyle() {
    let originalAfterFit = this.chart.Legend.prototype.afterFit;
    this.chart.Legend.prototype.afterFit = function () {
      originalAfterFit.call(this);

      // fix style
      let datasets = this.chart.config.data.datasets;
      if (datasets && datasets.length) {
        this.chart.legend.legendItems.map((item, i) => {
          if (datasets[i] !== undefined) {
            if (
              item.lineDash === undefined &&
              datasets[i].borderDash !== undefined
            ) {
              item.lineDash = datasets[i].borderDash;
            }
            if (
              item.lineDashOffset === undefined &&
              datasets[i].borderDashOffset !== undefined
            ) {
              item.lineDashOffset = datasets[i].borderDashOffset;
            }
            if (
              item.lineCap === undefined &&
              datasets[i].borderCapStyle !== undefined
            ) {
              item.lineCap = datasets[i].borderCapStyle;
            }
            if (
              item.pointStyle === undefined &&
              datasets[i].pointStyle !== undefined
            ) {
              item.pointStyle = datasets[i].pointStyle;
            }
          }
        });
      }
    };
  }

  legendLabels() {
    let helpers$1 = this.chart.helpers;
    let Chart = this.chart;
    let core_defaults = Chart.defaults;
    let getRtlHelper$1 = helpers$1.rtl.getRtlAdapter;
    let valueOrDefault$e = helpers$1.valueOrDefault;

    /**
     * Helper function to get the box width based on the usePointStyle option
     * @param {object} labelOpts - the label options on the legend
     * @param {number} fontSize - the label font size
     * @return {number} width of the color box area
     */
    function getBoxWidth(labelOpts, fontSize) {
      return labelOpts.boxWidth;
    }

    let originalDraw = this.chart.Legend.prototype.draw;
    this.chart.Legend.prototype.draw = function () {
      let me = this;
      let opts = me.options;
      let labelOpts = opts.labels;
      let globalDefaults = core_defaults.global;
      let defaultColor = globalDefaults.defaultColor;
      let lineDefault = globalDefaults.elements.line;
      let legendWidth = me.width;
      let lineWidths = me.lineWidths;

      let labelPaddingLeft = labelOpts.paddingLeft || 0;
      let labelPaddingRight = labelOpts.paddingRight || 0;
      let labelPaddingTop = labelOpts.paddingTop || 0;
      let labelPaddingBottom = labelOpts.paddingBottom || 0;

      if (!opts.display || !me.isHorizontal()) {
        return;
      }

      let rtlHelper = getRtlHelper$1(opts.rtl, me.left, me.minSize.width);
      let ctx = me.ctx;
      let fontColor = valueOrDefault$e(
        labelOpts.fontColor,
        globalDefaults.defaultFontColor
      );
      let labelFont = helpers$1.options._parseFont(labelOpts);
      let fontSize = labelFont.size;
      let cursor;

      // Canvas setup
      ctx.textAlign = rtlHelper.textAlign("left");
      ctx.textBaseline = "middle";
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = fontColor; // for strikethrough effect
      ctx.fillStyle = fontColor; // render in correct colour
      ctx.font = labelFont.string;

      let boxWidth = getBoxWidth(labelOpts, fontSize);
      let hitboxes = me.legendHitBoxes;

      // update line widths (all legend labels width + boxes)
      me.legendItems.map((item, i) => {
        let width =
          boxWidth * Math.SQRT2 + fontSize + ctx.measureText(item.text).width;

        if (
          i === 0 ||
          lineWidths[lineWidths.length - 1] + width + 2 * labelOpts.padding >
            me.minSize.width
        ) {
          // totalHeight += fontSize + labelOpts.padding;
          lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
        }

        hitboxes[i].width = width;
        lineWidths[lineWidths.length - 1] += width + labelOpts.padding / 2;
      });

      // current position
      let drawLegendBox = function (x, y, legendItem) {
        if (isNaN(boxWidth) || boxWidth <= 0) {
          return;
        }

        // Set the ctx for the box
        ctx.save();

        let lineWidth = valueOrDefault$e(
          legendItem.lineWidth,
          lineDefault.borderWidth
        );
        ctx.fillStyle = valueOrDefault$e(legendItem.fillStyle, defaultColor);
        ctx.lineCap = valueOrDefault$e(
          legendItem.lineCap,
          lineDefault.borderCapStyle
        );
        ctx.lineDashOffset = valueOrDefault$e(
          legendItem.lineDashOffset,
          lineDefault.borderDashOffset
        );
        ctx.lineJoin = valueOrDefault$e(
          legendItem.lineJoin,
          lineDefault.borderJoinStyle
        );
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = valueOrDefault$e(
          legendItem.strokeStyle,
          defaultColor
        );

        if (ctx.setLineDash) {
          // IE 9 and 10 do not support line dash
          ctx.setLineDash(
            valueOrDefault$e(legendItem.lineDash, lineDefault.borderDash)
          );
        }

        if (labelOpts && labelOpts.usePointStyle) {
          // Recalculate x and y for drawPoint() because its expecting
          // x and y to be center of figure (instead of top left)
          let radius = (boxWidth * Math.SQRT2) / 2;
          let centerX = rtlHelper.xPlus(x, boxWidth / 2);
          let centerY = y + fontSize / 2;

          // Draw pointStyle as legend symbol
          helpers$1.canvas.drawPoint(
            ctx,
            legendItem.pointStyle,
            radius,
            centerX,
            centerY,
            legendItem.rotation
          );
        } else {
          // Draw box as legend symbol
          ctx.fillRect(
            rtlHelper.leftForLtr(x, boxWidth),
            y,
            boxWidth,
            fontSize
          );
          if (lineWidth !== 0) {
            ctx.strokeRect(
              rtlHelper.leftForLtr(x, boxWidth),
              y,
              boxWidth,
              fontSize
            );
          }
        }

        ctx.restore();
      };

      let fillText = function (x, y, legendItem, textWidth) {
        let halfFontSize = fontSize / 2;
        let xLeft = rtlHelper.xPlus(x, boxWidth + halfFontSize);
        let yMiddle = y + halfFontSize;

        ctx.fillText(legendItem.text, xLeft, yMiddle);

        if (legendItem.hidden) {
          // Strikethrough the text if hidden
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.moveTo(xLeft, yMiddle);
          ctx.lineTo(rtlHelper.xPlus(xLeft, textWidth), yMiddle);
          ctx.stroke();
        }
      };

      let alignmentOffset = function (dimension, blockSize) {
        switch (opts.align) {
          case "start":
            return labelOpts.padding + labelPaddingLeft;
          case "end":
            let offset =
              dimension - blockSize - labelPaddingRight - boxWidth * Math.SQRT2;
            return offset < 0 ? 0 : offset;
          default:
            // center
            return (dimension - blockSize + labelOpts.padding) / 2;
        }
      };

      cursor = {
        x: me.left + alignmentOffset(legendWidth, lineWidths[0]),
        y: me.top + labelOpts.padding,
        line: 0,
      };

      helpers$1.rtl.overrideTextDirection(me.ctx, opts.textDirection);

      let itemHeight = fontSize + labelOpts.padding * 2;
      helpers$1.each(me.legendItems, function (legendItem, i) {
        let textWidth = ctx.measureText(legendItem.text).width;
        //let width = boxWidth + (fontSize / 2) + textWidth;
        let width = boxWidth + fontSize / 2 + textWidth;
        let x = cursor.x;
        let y = cursor.y;

        rtlHelper.setWidth(me.minSize.width);

        // Use (me.left + me.minSize.width) and (me.top + me.minSize.height)
        // instead of me.right and me.bottom because me.width and me.height
        // may have been changed since me.minSize was calculated
        if (
          i > 0 &&
          x + width + labelOpts.padding + labelPaddingLeft >
            me.left + me.minSize.width
        ) {
          y = cursor.y += itemHeight;
          cursor.line++;
          x = cursor.x =
            me.left + alignmentOffset(legendWidth, lineWidths[cursor.line]);
        }

        let realX = rtlHelper.x(x) + (boxWidth * Math.SQRT2) / 2;

        drawLegendBox(realX, y, legendItem);

        realX += 10;

        hitboxes[i].left = rtlHelper.leftForLtr(realX, hitboxes[i].width);
        hitboxes[i].top = y;

        // Fill the actual label
        fillText(realX, y, legendItem, textWidth);
        cursor.x += width + labelOpts.padding + boxWidth * Math.SQRT2;
      });

      helpers$1.rtl.restoreTextDirection(me.ctx, opts.textDirection);
    };
  }
}

module.exports = Theme;
