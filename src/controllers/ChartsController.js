const ChartsService = require('../Charts')
const fontsList = require('../fonts/index');

class ChartsController {

    get(req) {
        const validationResult = this.validatePayload(req);
        if (typeof validationResult !== "boolean" && validationResult) {
            return JSON.stringify(validationResult);
        }

        let chart = new ChartsService(req)

        return chart.get()
            .then((data) => data)
            .catch(console.error)
    }

    validateLabelsArray(labelsArray) {
        if (!Array.isArray(labelsArray)) {
            return { errorMessage: "'labels' param of 'data' object must be an array." }
        }
        if (labelsArray.some(label => typeof label !== "string")) {
            return { errorMessage: "'labels' array of 'data' object must only contain values of string type " }
        }
        return true;
    }

    validateDatasetsArray(datasetsArray) {
        if (!Array.isArray(datasetsArray)) {
            return { errorMessage: "'datasets' param of 'data' object must be an array." }
        }
        if (datasetsArray.some(dataset => typeof dataset !== "object" || typeof dataset.label !== "string" || !Array.isArray(dataset.data))) {
            return { errorMessage: "Each record of 'datasets' array must be an object containing 'label' param of string  type and 'data' array param (list of actual data records)" }
        }
        return true;
    }

    validateDataObject(dataObject) {
        const REQUIRED_DATA_PARAMS = ['labels', 'datasets'];

        if (!dataObject || typeof dataObject !== "object") {
            return { errorMessage: "Missing 'data' param of object type" }
        }
        const dataObjectParamNames = Object.keys(dataObject);
        const areOnlyRequiredDataParamsPassed = dataObjectParamNames.every(param => REQUIRED_DATA_PARAMS.includes(param));
        if (!areOnlyRequiredDataParamsPassed) {
            return { errorMessage: `'data' object must only contain ${REQUIRED_DATA_PARAMS.join(", ")}  params` }
        }
        const labelsValidationResult = this.validateLabelsArray(dataObject.labels)
        if (typeof labelsValidationResult !== "boolean") {
            return labelsValidationResult
        }
        const datasetsValidationResult = this.validateDatasetsArray(dataObject.datasets)
        if (typeof datasetsValidationResult !== "boolean") {
            return datasetsValidationResult
        }
        return true;
    }

    validatePayload(payload) {
        const REQUIRED_PAYLOAD_PARAMS = ['width', 'height', 'fontFamily', 'data'];

        if (!payload || typeof payload !== "object") {
            return { errorMessage: "Missing payload object" }
        }
        const payloadParamNames = Object.keys(payload);
        const areOnlyRequiredDataParamsPassed = payloadParamNames.every(param => REQUIRED_PAYLOAD_PARAMS.includes(param));
        if (!areOnlyRequiredDataParamsPassed) {
            return { errorMessage: `payload object must only contain ${REQUIRED_PAYLOAD_PARAMS.join(", ")} params` }
        }
        if (typeof payload.width !== "number") {
            return { errorMessage: "Missing 'width' param of number type"}
        }
        if (typeof payload.height !== "number") {
            return { errorMessage: "Missing 'height' param of number type"}
        }
        if (typeof payload.fontFamily !== "string" || !fontsList.some(({ fontName }) => payload.fontFamily === fontName)) {
            return { errorMessage: `Missing 'fontFamily' param having one of the following values: ${fontsList.map(({ fontName }) => fontName).join(", ")}`}
        }
        return this.validateDataObject(payload.data);
    }
}

module.exports = new ChartsController()