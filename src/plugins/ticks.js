// @ts-nocheck

const Chart = require('chart.js')

/**
 * @type Chart.Plugin
 */
const ticks = {
    id: "ticks-plugin",
    beforeDraw: function(chart) {
        // hide original tick
        if (chart.scales['x-axis'] !== undefined) {
            chart.scales['x-axis'].options.ticks.fontColor = 'transparent';
        }
    },
    afterDraw: (chart) => {
        let helpers_core = Chart.helpers
        let helpers$1 = helpers_core
        let valueOrDefault$a = helpers$1.valueOrDefault
        let defaults = {
            /**
             * @private
             */
            _set: function(scope, values) {
                return helpers_core.merge(this[scope] || (this[scope] = {}), values);
            },
            showLines: true
        }

        function parseFontOptions(options, nestedOpts) {
            return helpers$1.extend(helpers$1.options._parseFont({
                fontFamily: valueOrDefault$a(nestedOpts.fontFamily, options.fontFamily),
                fontSize: valueOrDefault$a(nestedOpts.fontSize, options.fontSize),
                fontStyle: valueOrDefault$a(nestedOpts.fontStyle, options.fontStyle),
                lineHeight: valueOrDefault$a(nestedOpts.lineHeight, options.lineHeight)
            }), {
                color: helpers$1.options.resolve([nestedOpts.fontColor, options.fontColor, defaults.defaultFontColor])
            })
        }

        function parseTickFontOptions(options) {
            let minor = parseFontOptions(options, options.minor)
            let major = options.major.enabled ? parseFontOptions(options, options.major) : minor
            return {minor: minor, major: major}
        }

        let ctx = chart.ctx
        let xAxis = chart.scales['x-axis']
        if (!xAxis || xAxis === undefined) {
            return
        }

        // loop through ticks to draw object
        Chart.helpers.each(xAxis._ticksToDraw, function(tick, index) {
            let xPadding = xAxis.options.ticks.padding || 10
            let xPos = xAxis.getPixelForTick(tick._index) + xPadding / 2
            let yPos = xAxis.top + xPadding * 2

            if (xPos - (xPadding * 2) > xAxis.width + (xPadding * 2)) {
                return
            }

            let fonts = parseTickFontOptions(xAxis.options.ticks);
            let font = tick.major ? fonts.major : fonts.minor;

            // draw tick
            ctx.save()
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'left'
            ctx.fillStyle = xAxis.options.scaleLabel.fontColor || font.color
            ctx.font = font.string
            ctx.fillText(tick.label, xPos, yPos)
            ctx.restore()

            let textWidth = ctx.measureText(tick.label).width
            let startXPosLine = xAxis.getPixelForTick(tick._index) + (textWidth / 2) + (xPadding / 2)
            let startYPosLine = xAxis.top - xPadding / 2
            let endXPosLine = xAxis.getPixelForTick(tick._index) + (textWidth / 2) + (xPadding / 2)
            let endYPosLine = xAxis.top + (xPadding / 2)

            // draw vertical line
            ctx.beginPath()
            ctx.moveTo(startXPosLine, startYPosLine)
            ctx.lineTo(endXPosLine, endYPosLine)
            ctx.lineWidth = xAxis.options.gridLines.lineWidth || 0.5
            ctx.strokeStyle = xAxis.options.gridLines.color || defaults.defaultColor
            ctx.lineCap = 'butt'
            ctx.stroke()
            ctx.restore()
        });
    }
}

module.exports = ticks
