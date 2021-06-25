import { generateChart } from '../src/generateChart'

describe(generateChart, () => {
  it('should reject on invalid input', async () => {
    await expect(generateChart('')).rejects.toThrow()
  })

  it('should pass on valid input', async () => {
    await expect(
      generateChart(JSON.stringify(await import('./fixtures/payloads/one_line.json')))
    ).resolves.toBeInstanceOf(Buffer)
  })
})
