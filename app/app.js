import { INDICATORS, SERIES } from "./data.js";
import { areaChart, lineChart } from "./charts.js";

const NF0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const NF1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const NF2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const byCode = new Map(INDICATORS.map((indicator) => [indicator.code, indicator]));

function numberText(indicator) {
  const value = indicator.value;
  switch (indicator.code) {
    case "SP.POP.TOTL":
      return NF0.format(value);
    case "NY.GDP.MKTP.CD":
      return `$${NF2.format(value / 1e9)}bn`;
    case "NY.GDP.PCAP.CD":
      return `$${NF0.format(value)}`;
    case "SP.DYN.LE00.IN":
      return NF1.format(value);
    case "SP.DYN.TFRT.IN":
      return NF2.format(value);
    case "SI.POV.GINI":
      return NF1.format(value);
    case "EG.ELC.RNEW.ZS":
      return `${NF2.format(value)}%`;
    default:
      return `${NF1.format(value)}%`;
  }
}

function unitText(indicator) {
  if (indicator.unit.startsWith("%")) return indicator.unit.replace(/^%\s*/, "");
  return indicator.unit;
}

function tableText(indicator) {
  if (indicator.code === "SP.POP.TOTL") return `${numberText(indicator)} people`;
  if (indicator.code === "SP.DYN.LE00.IN") return `${numberText(indicator)} years`;
  return numberText(indicator);
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderKpi(indicator) {
  const item = makeElement("div", "kpi");
  const value = makeElement("span", "kpi-value");
  value.append(document.createTextNode(numberText(indicator)));
  value.append(makeElement("span", "kpi-unit", unitText(indicator)));
  item.append(
    makeElement("span", "kpi-label", indicator.name),
    value,
    makeElement("span", "kpi-source", `World Bank WDI \u00b7 ${indicator.year}`),
  );
  return item;
}

function renderCard(indicator) {
  const card = makeElement("article", "card");
  const meta = makeElement("span", "card-meta");
  meta.append(
    makeElement("span", "", "World Bank WDI"),
    makeElement("span", "", String(indicator.year)),
  );
  card.append(
    makeElement("span", "card-label", indicator.name),
    makeElement("span", "card-value", numberText(indicator)),
    makeElement("span", "card-unit", unitText(indicator)),
    meta,
  );
  return card;
}

function renderEnergy(indicator) {
  const figure = makeElement("article", "energy-figure");
  figure.append(
    makeElement("span", "energy-label", indicator.name),
    makeElement("span", "energy-value", numberText(indicator)),
    makeElement("span", "energy-unit", unitText(indicator)),
    makeElement("span", "energy-meta", `World Bank WDI \u00b7 ${indicator.year}`),
  );
  return figure;
}

function renderAll(selector, indicators, renderer) {
  const mount = document.querySelector(selector);
  if (!mount) return;
  mount.append(...indicators.map(renderer));
}

renderAll("#hero-figures", ["SP.POP.TOTL", "NY.GDP.PCAP.CD", "SP.DYN.LE00.IN"].map((code) => byCode.get(code)), renderKpi);
renderAll("#economy-cards", ["NY.GDP.MKTP.CD", "NY.GDP.MKTP.KD.ZG", "NY.GDP.PCAP.CD", "FP.CPI.TOTL.ZG", "SL.UEM.TOTL.ZS", "NE.TRD.GNFS.ZS"].map((code) => byCode.get(code)), renderCard);
renderAll("#society-cards", ["SP.POP.TOTL", "SP.POP.GROW", "SP.POP.65UP.TO.ZS", "SP.URB.TOTL.IN.ZS", "SP.DYN.TFRT.IN", "IT.NET.USER.ZS", "SH.XPD.CHEX.GD.ZS", "SE.XPD.TOTL.GD.ZS", "SI.POV.GINI"].map((code) => byCode.get(code)), renderCard);
renderAll("#energy-figures", ["EG.ELC.RNEW.ZS", "EG.FEC.RNEW.ZS", "AG.LND.FRST.ZS"].map((code) => byCode.get(code)), renderEnergy);

document.querySelector("#population-chart").innerHTML = areaChart(SERIES.population, {
  height: 260,
  unit: "PEOPLE",
  label: "Population of Iceland, 1960 to 2024",
  format: (value) => NF0.format(value),
});

document.querySelector("#gdp-chart").innerHTML = lineChart(SERIES.gdpPerCapita, {
  height: 220,
  unit: "US$ PER PERSON",
  label: "GDP per capita in Iceland, 1995 to 2024",
  format: (value) => `$${NF0.format(value)}`,
});

document.querySelector("#life-chart").innerHTML = lineChart(SERIES.lifeExpectancy, {
  height: 220,
  unit: "YEARS",
  label: "Life expectancy at birth in Iceland, 1960 to 2024",
  format: (value) => NF1.format(value),
});

const methodsBody = document.querySelector("#methods-body");
const methodRows = INDICATORS.map((indicator) => {
  const row = document.createElement("tr");
  row.append(
    makeElement("td", "", indicator.code),
    makeElement("td", "", indicator.name),
  );
  return row;
});
methodsBody.append(...methodRows);

const tableBody = document.querySelector("#data-body");
const countLine = document.querySelector("#count");
const filterInput = document.querySelector("#filter");
const headers = [...document.querySelectorAll("#data-table thead th[data-key]")];
const state = { query: "", key: null, direction: 1 };

function compare(left, right, key) {
  if (key === "value" || key === "year") return left[key] - right[key];
  return String(left[key]).localeCompare(String(right[key]), "en", { sensitivity: "base" });
}

function updateHeaders() {
  headers.forEach((header) => {
    const active = header.dataset.key === state.key;
    header.setAttribute("aria-sort", active ? (state.direction === 1 ? "ascending" : "descending") : "none");
    header.querySelector(".arrow").textContent = active ? (state.direction === 1 ? "\u2191" : "\u2193") : "";
  });
}

function renderTable() {
  const query = state.query.trim().toLowerCase();
  let rows = INDICATORS.filter((indicator) => `${indicator.name} ${indicator.group}`.toLowerCase().includes(query));
  if (state.key) {
    rows = rows.slice().sort((left, right) => compare(left, right, state.key) * state.direction);
  }

  const fragment = document.createDocumentFragment();
  rows.forEach((indicator) => {
    const row = document.createElement("tr");
    row.append(
      makeElement("td", "", indicator.name),
      makeElement("td", "group", indicator.group),
      makeElement("td", "num", tableText(indicator)),
      makeElement("td", "num", String(indicator.year)),
    );
    fragment.append(row);
  });

  if (rows.length === 0) {
    const row = document.createElement("tr");
    const cell = makeElement("td", "empty", `No indicators match "${state.query.trim()}".`);
    cell.colSpan = 4;
    row.append(cell);
    fragment.append(row);
  }

  tableBody.replaceChildren(fragment);
  countLine.textContent = `Showing ${rows.length} of ${INDICATORS.length} indicators`;
  updateHeaders();
}

headers.forEach((header) => {
  header.querySelector("button").addEventListener("click", () => {
    const key = header.dataset.key;
    if (state.key === key) {
      state.direction *= -1;
    } else {
      state.key = key;
      state.direction = 1;
    }
    renderTable();
  });
});

filterInput.addEventListener("input", () => {
  state.query = filterInput.value;
  renderTable();
});

renderTable();
