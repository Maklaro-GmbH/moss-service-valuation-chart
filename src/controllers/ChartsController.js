const ChartsService = require('../Charts')

class ChartsController {

    get(req) {
        const validationResult = this.validatePayload(req);
        if (typeof validationResult !== "boolean" && validationResult) {
            return JSON.stringify(validationResult);
        }

        let chart = new ChartsService(req)

        return chart.get()
            .then((data) => {
                console.log(data)
                return data
            })
            .catch(console.error)
    }

    validateDataObject(dataObject) {
        const REQUIRED_DATA_PARAMS = ['labels', 'datasets'];

        if (!dataObject || typeof dataObject !== "object") {
            return { errorMessage: "Missing 'data' param of object type" }
        }
        const dataObjectParamNames = Object.keys(dataObject);
        const areOnlyRequiredDataParamsPassed = dataObjectParamNames.every(param => REQUIRED_DATA_PARAMS.includes(param));
        if (!areOnlyRequiredDataParamsPassed) {
            return { errorMessage: "'data' object must only contain 'labels' and 'datasets' params" }
        }
        return false;
    }

    validatePayload(payload) {
        if (!payload || typeof payload !== "object") {
            return { errorMessage: "Missing payload" }
        }
        if (typeof payload.width !== "number") {
            return { errorMessage: "Missing 'width' param of number type"}
        }
        if (typeof payload.height !== "number") {
            return { errorMessage: "Missing 'height' param of number type"}
        }
        return this.validateDataObject(payload.data);
    }
}

module.exports = new ChartsController()