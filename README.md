# Maklaro valuation-chart-service

Contains chart-node-canvas ChartJS implementation.

## Docker

```bash
docker-compose build
docker-compose run --rm --user 1000:1000 node yarn install --frozen-lockfile
```

## Run bin exec file

```bash
docker-compose run --rm --user 1000:1000 node bin/chart-valuation-service [json]
```

## Test the service

```bash
docker-compose run --rm --user 1000:1000 node bin/chart-valuation-service < tests/data/test1.json > chart.png
```

In order to generate the chart, pass JSON structured as IPayload interface to the chart-valuation-service script:

```typescript
interface IPayload {
  width: number;
  height: number;
  styling: IStyling;
  data: IData;
}

interface IStyling {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
}

interface IData {
  labels: string[];
  datasets: IDatasets[];
}

interface IDatasets {
  label: string;
  yAxis: IYAxis;
  data: IDataRecord[];
}
interface IDataRecord {
  [key: string]: string; // value on x Axis
  y: number
}

interface IYAxis {
  position: 'left' | 'right';
  label: string;
  ticks: {
    maxTicksLimit: number;
    min: number;
    max: number;
  }
}
```
You can find the example payloads in /src/tests/fixtures/payload
