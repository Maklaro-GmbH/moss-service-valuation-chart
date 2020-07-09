const fontsList = require('../fonts/index')

const messages = {
  invalidType: (paramName, paramType) =>
    `Missing '${paramName}' param of ${paramType} type`,
  invalidFontFamily: `Missing 'fontFamily' param of one of the following values: ${fontsList
    .map(({ fontName }) => fontName)
    .join(', ')}`,
  notAcceptedParamsPassed: (objectName, availableFieldsList) =>
    `${objectName} must contain following fields: [${availableFieldsList.join(
      ', '
    )}]`,
  arrayRecordOfWrongType: (arrayName, arrayType) =>
    `${arrayName} must only contain values of ${arrayType} type.`,
  outOfEnumsRange: (paramName, enumsList) =>
    `${paramName} must be oe one of the following values: [${enumsList.join(
      ', '
    )}]`
}

module.exports = messages
