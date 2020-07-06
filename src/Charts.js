const { CanvasRenderService } = require('chartjs-node-canvas')
//const ChartJsFactory = require('./ChartJsFactory')
const Theme = require('./Theme')
const ticks = require('./plugins/ticks')

class Charts {

    constructor(req) {
        this.width = req.width ? req.width : 600
        this.height = req.height ? req.height : 350
        this.global = req.global ? req.global : null
        this.config = req.config

        this.prepareOptions()
        this.setAxesTicks()
        this.setCanvasService()
    }

    prepareOptions() {
        if (typeof this.config.options === 'undefined') {
            this.config.options = {}
        } else {
            let options = this.config.options
            this.config.options = {}
            for (let i in options) {
                this.config.options[i] = options[i]
            }
        }
    }

    setCanvasService() {
        if (!this.canvasService) {
            //this.canvasService = new CanvasRenderService(this.width, this.height, undefined, undefined, ChartJsFactory)
            this.canvasService = new CanvasRenderService(this.width, this.height, undefined, undefined, () => {
                let ChartJS = require('chart.js')

                ChartJS.defaults.global.devicePixelRatio = 2
                ChartJS.plugins.register(ticks)

                if (this.global) {
                    for (let i in this.global) {
                        ChartJS.defaults.global[i] = this.global[i]
                    }
                }

                let theme = new Theme(ChartJS)
                theme.init()
                
                delete require.cache[require.resolve('chart.js')]
                return ChartJS
            })

            this.canvasService.registerFont(__dirname + '/./fonts/Value-Regular.ttf', {family: 'Value'})
            this.canvasService.registerFont(__dirname + '/./fonts/Frutiger-Regular.ttf', {family: 'Frutiger'})
            this.canvasService.registerFont(__dirname + '/./fonts/Frutiger-Bold.ttf', {family: 'Frutiger Bold'})
            this.canvasService.registerFont(__dirname + '/./fonts/SparBd.ttf', {family: 'Spar Bold'})
            this.canvasService.registerFont(__dirname + '/./fonts/SparRg.ttf', {family: 'Spar'})
            this.canvasService.registerFont(__dirname + '/./fonts/MinionPro-Regular.ttf', {family: 'MinionPro'})
            this.canvasService.registerFont(__dirname + '/./fonts/MinionPro-Bold.ttf', {family: 'MinionPro Bold'})
            this.canvasService.registerFont(__dirname + '/./fonts/Segoe-UI.ttf', {family: 'Segoe UI'})
            this.canvasService.registerFont(__dirname + '/./fonts/Segoe-UI-Bold.ttf', {family: 'Segoe UI Bold'})
            this.canvasService.registerFont(__dirname + '/./fonts/Segoe-UI-Bold-Italic.ttf', {family: 'Segoe UI Bold Italic'})
            this.canvasService.registerFont(__dirname + '/./fonts/Segoe-UI-Italic.ttf', {family: 'Segoe UI Italic'})
        }
    }

    async get() {
        return this.canvasService.renderToBuffer(this.config)
    }

    setAxesTicks() {
        if (this.config.options && 
            this.config.options.scales !== undefined && 
            this.config.options.scales.yAxes !== undefined && 
            this.config.options.scales.yAxes.length
        ) {
            this.config.options.scales.yAxes.map((item, i) => {
                if (item.ticks !== undefined) {
                    if (item.id === 'left-y-axis') {
                        item.ticks.callback = (value) => {
                            return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                                .replace(/,/g, '.')
                        }
                    }

                    if (item.id === 'right-y-axis') {
                        item.ticks.callback = (value, index, values) => {
                            if (value % 1 === 0) {
                                return value.toString() + ',-'
                            } else {
                                return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    .replace('.', ',')
                            }
                        }
                    }
                }
            })
        }
    }
}

module.exports = Charts
