// Hand-written SVG charts. No library, no runtime requests.
const COLORS = {
  glacier: "#2f6f86",
  lava: "#a8432a",
  rule: "#bdb4a1",
  lineGrid: "#b0a68f",
  muted: "#6f6a5f",
  ink: "#171a1f",
  paper: "#f3f0e8",
};

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function niceStep(value) {
  const power = 10 ** Math.floor(Math.log10(value));
  const ratio = value / power;
  const multiple = ratio <= 1 ? 1 : ratio <= 2 ? 2 : ratio <= 5 ? 5 : 10;
  return multiple * power;
}

function valueBounds(points, zeroBased) {
  const values = points.map((point) => point[1]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (zeroBased) {
    const step = niceStep(max / 4);
    return [0, step * Math.ceil(max / step)];
  }
  const span = max - min;
  const step = niceStep(span / 4);
  return [
    Math.floor((min - span * 0.02) / step) * step,
    Math.ceil((max + span * 0.02) / step) * step,
  ];
}

function plot(points, options) {
  const width = Math.max(260, Math.round(options.width ?? 720));
  const height = options.height ?? 220;
  const narrow = width < 480;
  const margin = {
    left: narrow ? 66 : 70,
    right: options.kind === "line" ? (narrow ? 22 : 24) : (narrow ? 14 : 20),
    top: narrow ? 24 : 26,
    bottom: narrow ? 30 : 34,
  };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const [minBound, maxBound] = valueBounds(points, options.kind === "area");
  const minY = options.yMin ?? minBound;
  const maxY = options.yMax ?? maxBound;
  const years = points.map((point) => point[0]);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const xFor = (year) => ((year - minYear) / (maxYear - minYear)) * plotWidth;
  const yFor = (value) => (1 - (value - minY) / (maxY - minY)) * plotHeight;
  const coordinates = points.map(([year, value]) => [xFor(year), yFor(value)]);
  const linePath = coordinates
    .map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const areaPath = options.kind === "area"
    ? `M0 ${plotHeight.toFixed(2)} L${coordinates.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L")} L${plotWidth.toFixed(2)} ${plotHeight.toFixed(2)} Z`
    : "";

  const tickFont = 13;
  const yearFont = 13;
  const endpointFont = 14.5;
  const dotRadius = 6;
  const lineWidth = 3;

  const gridColor = options.kind === "line" ? COLORS.lineGrid : COLORS.rule;
  const yTickValues = options.yTicks ?? [0, 0.25, 0.5, 0.75, 1].map((fraction) => maxY - fraction * (maxY - minY));
  const gridValues = yTickValues.filter((value) => value > minY + 1e-9);
  const gridlines = gridValues.map((value) => {
    const y = margin.top + yFor(value);
    return `<line x1="${margin.left}" y1="${y.toFixed(2)}" x2="${margin.left + plotWidth}" y2="${y.toFixed(2)}" stroke="${gridColor}" stroke-width="1.2" />`;
  }).join("");

  const yLabels = yTickValues.map((value) => {
    const y = margin.top + yFor(value);
    return `<text x="${margin.left - 8}" y="${(y + 3.5).toFixed(2)}" text-anchor="end" font-size="${tickFont}" fill="${COLORS.muted}">${escapeXml(options.format ? options.format(value) : value)}</text>`;
  }).join("");

  const [lastX, lastY] = coordinates[coordinates.length - 1];
  const lastValue = points[points.length - 1][1];
  const lastLabel = escapeXml(options.format ? options.format(lastValue) : lastValue);
  const labelWidth = lastLabel.length * endpointFont * 0.66;
  const nearbyLineY = Math.max(
    ...coordinates.filter(([x]) => x >= lastX - labelWidth - 4).map(([, y]) => y),
    lastY,
  );
  const endpointOffset = Math.max(24, nearbyLineY - lastY + 18);
  const endpointY = lastY + endpointOffset;
  const baseline = margin.top + plotHeight;
  const yearTicks = options.yearTicks ?? [minYear, maxYear];
  const yearLabels = yearTicks.map((year, index) => {
    const x = margin.left + xFor(year);
    const anchor = index === 0 ? "start" : index === yearTicks.length - 1 ? "end" : "middle";
    return `<text x="${x.toFixed(2)}" y="${height - 8}" text-anchor="${anchor}" font-size="${yearFont}" fill="${COLORS.muted}">${year}</text>`;
  }).join("");

  const plotMarkup = options.kind === "area"
    ? `<path d="${areaPath}" fill="${COLORS.glacier}" fill-opacity="0.14" /><path d="${linePath}" fill="none" stroke="${COLORS.glacier}" stroke-width="${lineWidth}" stroke-linejoin="round" stroke-linecap="round" />`
    : `<path d="${linePath}" fill="none" stroke="${COLORS.glacier}" stroke-width="${lineWidth}" stroke-linejoin="round" stroke-linecap="round" />`;

  const unitLabel = options.unitAlign === "axis"
    ? `<text x="${margin.left - 8}" y="${margin.top - 14}" text-anchor="end" font-size="${tickFont}" letter-spacing="0.08em" fill="${COLORS.muted}">${escapeXml(options.unit ?? "")}</text>`
    : `<text x="${(margin.left + plotWidth).toFixed(2)}" y="${margin.top - 6}" text-anchor="end" font-size="${tickFont}" letter-spacing="0.08em" fill="${COLORS.muted}">${escapeXml(options.unit ?? "")}</text>`;

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(options.label ?? "Chart")}">
  ${unitLabel}
  ${gridlines}
  <line x1="${margin.left}" y1="${baseline.toFixed(2)}" x2="${margin.left + plotWidth}" y2="${baseline.toFixed(2)}" stroke="${COLORS.ink}" stroke-width="1" opacity="0.65" />
  <svg x="${margin.left}" y="${margin.top}" width="${plotWidth}" height="${plotHeight}" viewBox="0 0 ${plotWidth} ${plotHeight}" preserveAspectRatio="none" aria-hidden="true">${plotMarkup}</svg>
  ${yLabels}
  <text x="${(lastX + margin.left).toFixed(2)}" y="${(endpointY + margin.top).toFixed(2)}" text-anchor="end" font-size="${endpointFont}" font-weight="600" fill="${COLORS.ink}" paint-order="stroke" stroke="${COLORS.paper}" stroke-width="3" stroke-linejoin="round">${lastLabel}</text>
  <circle cx="${(lastX + margin.left).toFixed(2)}" cy="${(lastY + margin.top).toFixed(2)}" r="${dotRadius}" fill="${COLORS.lava}" stroke="${COLORS.paper}" stroke-width="1.5" />
  ${yearLabels}
</svg>`;
}

export function areaChart(points, options = {}) {
  return plot(points, { ...options, kind: "area", height: options.height ?? 260 });
}

export function lineChart(points, options = {}) {
  return plot(points, { ...options, kind: "line", height: options.height ?? 220 });
}
