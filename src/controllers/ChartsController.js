const ChartsService = require('../Charts')

class ChartsController {

    get(req) {
        if (!this.validate(req)) {
            return JSON.stringify({"errorMessage": "Missing chart config"})
        }

        let chart = new ChartsService(req)

        return chart.get()
            .then((data) => {
                console.log(data)
                return data
            })
            .catch(console.error)
    }

    validate(req) {
        if (!req || !req.config) {
            return false
        }
        return true
    }
}

module.exports = new ChartsController()