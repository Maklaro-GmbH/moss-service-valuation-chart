# Maklaro valuation-chart-service

Contains chart-node-canvas ChartJS implementation.

## Install dependencies

```bash
docker-compose build
docker-compose run --rm --user 1000:1000 node yarn install --frozen-lockfile
```

## Update dependencies
```bash
docker-compose run --rm --user 1000:1000 node yarn upgrade-interactive --latest
```

## Run bin exec file

```bash
docker-compose run --rm --user 1000:1000 node bin/chart-valuation-service [json]
```

## Test the service

```bash
docker-compose run --rm --user 1000:1000 node yarn install --frozen-lockfile
docker-compose run --rm --user 1000:1000 node bin/chart-valuation-service < tests/fixtures/payloads/one_line.json > chart_1.png
docker-compose run --rm --user 1000:1000 node bin/chart-valuation-service < tests/fixtures/payloads/two_lines.json > chart_2.png
```

## Run tests

```bash
docker-compose run --rm --user 1000:1000 node yarn test
```

In order to generate the chart, pass JSON matching the schema from /src/schemas/payload.js

You can find the example payloads in /tests/fixtures/payload
