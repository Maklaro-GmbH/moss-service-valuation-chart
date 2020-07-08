const fontsList = require("../fonts/index");

const messages = {
  missingPayload: "Missing payload object",
  invalidType: (paramName, paramType) =>
    `Missing '${paramName}' param of ${paramType} type`,
  invalidFontFamily: `Missing 'fontFamily' param of one of the following values: ${fontsList
    .map(({ fontName }) => fontName)
    .join(", ")}`,
  notAcceptedParamsPassed: (objectName, availableFieldsList) =>
    `${objectName} must only contain following fields: [${availableFieldsList.join(
      ", "
    )}]`,
  invalidDataRecordStructure:
    "Each record of 'datasets' array must be an object containing 'label' param of string  type and 'data' array param (list of actual data records)",
  arrayRecordWithWrongType: (arrayName, arrayType) =>
    `${arrayName} must only contain values of ${arrayType} type.`,
};

module.exports = messages;
