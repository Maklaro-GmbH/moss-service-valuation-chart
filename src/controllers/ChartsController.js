const ChartsService = require("../Charts");
const fontsList = require("../fonts/index");
const messages = require("../constants/messages");

class ChartsController {
  get(req) {
    try {
      this.validatePayload(req);

      let chart = new ChartsService(req);

      return chart
        .get()
        .then((data) => data)
        .catch(console.error);
    } catch (error) {
      return error;
    }
  }

  validateLabelsArray(labelsArray) {
    if (!Array.isArray(labelsArray))
      throw messages.invalidType("data.labels", "array");
    if (labelsArray.some((label) => typeof label !== "string"))
      throw messages.arrayRecordWithWrongType("data.labels", "string");
    return true;
  }

  validateDatasetsArray(datasetsArray) {
    if (!Array.isArray(datasetsArray))
      throw messages.invalidType("data.datasets", "array");
    const isSomeDataRecordWithInvalidStructure = datasetsArray.some(
      (dataset) =>
        typeof dataset !== "object" ||
        typeof dataset.label !== "string" ||
        typeof dataset.xAxisID !== "string" ||
        !Array.isArray(dataset.data)
    );
    if (isSomeDataRecordWithInvalidStructure)
      throw messages.invalidDataRecordStructure;
    return true;
  }

  validateDataObject(dataObject) {
    const REQUIRED_DATA_PARAMS = ["labels", "datasets"];

    if (typeof dataObject !== "object")
      throw messages.invalidType("data", "object");
    const dataObjectParamNames = Object.keys(dataObject);
    const areOnlyRequiredDataParamsPassed =
      dataObjectParamNames.length === REQUIRED_DATA_PARAMS.length &&
      dataObjectParamNames.every((param) =>
        REQUIRED_DATA_PARAMS.includes(param)
      );
    if (!areOnlyRequiredDataParamsPassed)
      throw messages.notAcceptedParamsPassed(
        "'data' object",
        REQUIRED_DATA_PARAMS
      );

    this.validateLabelsArray(dataObject.labels);
    this.validateDatasetsArray(dataObject.datasets);

    return true;
  }

  validatePayload(payload) {
    const REQUIRED_PAYLOAD_PARAMS = ["width", "height", "fontFamily", "data"];

    if (!payload || typeof payload !== "object") throw messages.missingPayload;

    const payloadParamNames = Object.keys(payload);
    const areOnlyRequiredDataParamsPassed =
      payloadParamNames.length === REQUIRED_PAYLOAD_PARAMS.length &&
      payloadParamNames.every((param) =>
        REQUIRED_PAYLOAD_PARAMS.includes(param)
      );
    if (!areOnlyRequiredDataParamsPassed)
      throw messages.notAcceptedParamsPassed(
        "payload",
        REQUIRED_PAYLOAD_PARAMS
      );
    if (typeof payload.width !== "number")
      throw messages.invalidType("width", "number");
    if (typeof payload.height !== "number")
      throw messages.invalidType("height", "number");
    if (!fontsList.some(({ fontName }) => payload.fontFamily === fontName))
      throw messages.invalidFontFamily;
    return this.validateDataObject(payload.data);
  }
}

module.exports = new ChartsController();
