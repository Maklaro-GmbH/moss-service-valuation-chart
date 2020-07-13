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
docker-compose run --rm --user 1000:1000 node bin/chart-valuation-service < tests/fixtures/payloads/one_line.json > chart.png
```

In order to generate the chart, pass JSON matching the schema from /src/schemas/payload.js

You can find the example payloads in /src/tests/fixtures/payload
