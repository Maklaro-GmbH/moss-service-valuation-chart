const messages = require('../constants/messages')

const typeCheckers = {
  isNumber: (value) => typeof value === 'number',
  isString: (value) => typeof value === 'string',
  isObject: (value) =>
    !!value && !Array.isArray(value) && typeof value === 'object',
  isArray: (value) => Array.isArray(value),
  isInEnumsRange: (value, enumsList) => enumsList.includes(value),
  checkRequiredParamsArePassed: (
    payloadToCheck,
    requiredParamNames,
    payloadPath = 'payload'
  ) => {
    if (!typeCheckers.isObject(payloadToCheck))
      throw messages.invalidType(payloadPath, 'object')
    const payloadObjectParamNames = Object.keys(payloadToCheck)
    const areAllRequiredParamsPassed = requiredParamNames.every((param) =>
      payloadObjectParamNames.includes(param)
    )
    if (!areAllRequiredParamsPassed)
      throw messages.notAcceptedParamsPassed(payloadPath, requiredParamNames)
    return true
  }
}

module.exports = typeCheckers
