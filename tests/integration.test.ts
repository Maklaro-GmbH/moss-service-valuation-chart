import Chart from '../src/Chart'

describe('chart generation integration', () => {
  it.each([['one_line.json'], ['two_lines.json']])(
    'should match the snapshot for %p',
    async (filename) => {
      const chart = new Chart(await import(`./fixtures/payloads/${filename}`))
      const chartBuffer = await chart.get()

      expect(chartBuffer).toMatchImageSnapshot()
    }
  )
})
