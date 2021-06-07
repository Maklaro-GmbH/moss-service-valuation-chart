import Chart from '../src/Chart'

describe('chart regression', () => {
  it.each([['one_line.json'], ['two_lines.json']])(
    'should match the snapshoot for %p',
    async (filename) => {
      const chart = new Chart(await import(`./fixtures/payloads/${filename}`))
      const chartBuffer = await chart.get()

      expect(chartBuffer).toMatchImageSnapshot()
    }
  )
})
