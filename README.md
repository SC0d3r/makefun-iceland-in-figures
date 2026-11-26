# Iceland in Figures

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/SC0d3r/makefun-iceland-in-figures/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/SC0d3r/makefun-iceland-in-figures/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

An independent statistical digest of Iceland: population, economy, society and
energy in one calm, single-page annual. Every figure is dated and sourced, and
the full table can be filtered and sorted.

## Data

All figures are the latest available World Bank World Development Indicators
observations for Iceland, extracted on 26 November 2026 from
<https://data.worldbank.org/country/ISL>. Values are shown rounded, never
adjusted; national sources may use different definitions and vintages.

## Run

```sh
node serve.ts
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The first command serves `app/` on <http://localhost:8080>. The second builds the
submission dossier into `out/`. The site itself is plain HTML, CSS and ES modules
with no build step and no runtime network requests.
