describe('chart regression', () => {
  it.each([
    ['one_line.json']
    // ['two_lines.json'], // disabled,
    // currently this library does not support creating multiple Chart instances in a stable manner,
    // any following chart instance will have some kind of artifacts
  ])('should match the snapshoot for %p', async (filename) => {
    const Chart = require('../src/Chart')
    const chart = new Chart(require(`./fixtures/payloads/${filename}`))
    const chartBuffer = await chart.get()

    expect(chartBuffer).toMatchImageSnapshot()
  })
})
