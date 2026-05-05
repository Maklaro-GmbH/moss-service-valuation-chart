import Chart from '../src/Chart'
import type { Payload } from '../src/schemas/payload'
import fixtureMossOne from './fixtures/payloads/moss_one'
import fixtureMossTwo from './fixtures/payloads/moss_two'
import fixtureOneLine from './fixtures/payloads/one_line'
import fixtureTwoLines from './fixtures/payloads/two_lines'

describe('chart generation integration', () => {
  it.each<readonly [string, Payload]>([
    ['moss_one.json', fixtureMossOne],
    ['moss_two.json', fixtureMossTwo],
    ['one_line.json', fixtureOneLine],
    ['two_lines.json', fixtureTwoLines],
  ])('should match the snapshot for %p', async (_filename, fixture) => {
    const chart = new Chart(fixture)
    const chartBuffer = await chart.get()

    expect(chartBuffer).toMatchImageSnapshot()
  })
})
