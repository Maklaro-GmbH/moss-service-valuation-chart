const chartsController = require("../../src/controllers/ChartsController");
const test_payload = require("../data/test3.json");

describe("ChartsController class", function () {
  it("should throw an error message when payload is not passed", async function () {
    const result = await chartsController.get();
    const expected = "Missing payload object";
    expect(result).toBe(expected);
  });

  it("should throw an error message describing what fields are required for payload object", async function () {
    const result = await chartsController.get({});
    const expected = "payload must only contain following fields:";
    expect(result).toContain(expected);
  });

  it("should throw an error complaining about 'width' type when it's not a number", async function () {
    const payload = { ...test_payload, width: "800" };
    const result = await chartsController.get(payload);
    const expected = "Missing 'width' param of number type";
    expect(result).toBe(expected);
  });

  it("should throw an error complaining about 'height' type when it's not a number", async function () {
    const payload = { ...test_payload, height: "800" };
    const result = await chartsController.get(payload);
    const expected = "Missing 'height' param of number type";
    expect(result).toBe(expected);
  });

  it("should throw an error complaining about 'fontFamily' when value doesn't match any of the enums", async function () {
    const payload = { ...test_payload, fontFamily: "font" };
    const result = await chartsController.get(payload);
    const expected =
      "Missing 'fontFamily' param of one of the following values:";
    expect(result).toContain(expected);
  });

  it("should throw an error complaining about required 'data' object params missing", async function () {
    const payload = { ...test_payload, data: {} };
    const result = await chartsController.get(payload);
    const expected =
      "'data' object must only contain following fields: [labels, datasets]";
    expect(result).toContain(expected);
  });

  it("should throw an error indicating 'labels' array should not have records with any other types but strings", async function () {
    const payload = {
      ...test_payload,
      data: { ...test_payload.data, labels: [1] },
    };
    const result = await chartsController.get(payload);
    const expected = "data.labels must only contain values of string type.";
    expect(result).toContain(expected);
  });
});
