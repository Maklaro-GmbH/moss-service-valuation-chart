# Maklaro valuation-chart-service

Contains skia-canvas ChartJS implementation.

Using docker is advised as it is a reliable way of getting reproducible results across different environment.

This app uses `yarn` as package manager.

## Startup

```bash
docker compose build
```

## Install Dependencies

```bash
docker compose run --rm --user 1000:1000 node yarn install --frozen-lockfile
```

## Update dependencies
```bash
docker compose run --rm --user 1000:1000 node yarn upgrade-interactive --latest
```

## Run bin exec file

```bash
docker compose run --rm --user 1000:1000 node bin/chart-valuation-service [json]
```

## Test the service

```bash
docker compose run --rm --user 1000:1000 node yarn install --frozen-lockfile
docker compose run --rm --user 1000:1000 node bin/chart-valuation-service < tests/fixtures/payloads/one_line.json > chart_1.png
docker compose run --rm --user 1000:1000 node bin/chart-valuation-service < tests/fixtures/payloads/two_lines.json > chart_2.png
```

## Lint

to check for errors:
```bash
docker compose run --rm --user 1000:1000 node yarn check
```
to fix errors:
```bash
docker compose run --rm --user 1000:1000 node yarn check:fix
```

## Run the tests

```bash
docker compose run --rm --user 1000:1000 node yarn test
```

In order to generate the chart, pass JSON matching the schema from /src/schemas/payload.js

You can find the example payloads in /tests/fixtures/payload

## Shutdown / Cleanup

```bash
docker compose down
```
