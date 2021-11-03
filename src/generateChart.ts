import Chart from './Chart'

type Lazy<T> = T | PromiseLike<T>

type Input<T> = Lazy<Iterable<Lazy<T>> | Lazy<AsyncIterable<Lazy<T>>>>

async function accumulateInput (input: Input<string>): Promise<string> {
  let accumulator: string = ''

  for await (const chunk of await input) {
    accumulator += await chunk
  }

  return accumulator
}

export async function generateChart (input: Input<string>): Promise<Buffer> {
  const chart = new Chart(JSON.parse(await accumulateInput(input)))

  const result = await chart.get()

  if (Buffer.isBuffer(result)) {
    return result
  }

  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw result
}
