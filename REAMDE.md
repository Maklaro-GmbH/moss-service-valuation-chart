# Maklaro valuation-chart-service

Contains chart-node-canvas chartjs implementation.

## Docker

```bash
docker build --tag chart-service .
docker run -it chart-service bash
```

## Run bin exec file

```bash
./bin/chart-valuation-service
```
In order to generate chart, pass JSON structured as IPayload interface to the chart-valuation-service script:
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
  position: string;
  label: string;
  ticks: {
    maxTicksLimit: number;
    min: number;
    max: number;
  }
}
```
You can find the example payloads in /src/tests/data
To generate & save images from those examples run ./tests/generateChar1.js or ./tests/generateChar2.js with node