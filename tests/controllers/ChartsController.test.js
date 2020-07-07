const chartsController = require('../../src/controllers/ChartsController');

describe('ChartsController class', function () {
    it('should throw an error message when payload is not passed', function () {
        const result = chartsController.get().errorMessage;
        const expected = "Missing payload object";
        expect(result).toBe(expected);
    });
});