import { select } from 'd3';

export const RECT_DIMENSION_RATIO = 0.383;
export const SQUARE_DIMENSION_RATIO = 1.0194;

// Constants from figma mockups
export function prorataScale(mockupValue, currentChartWidth, mockupChartWidth) {
  return (currentChartWidth * mockupValue) / mockupChartWidth;
}

const RECTCHART_ORIGINAL_WIDTH = 835;
export function scaleRectChart(mockupValue, currentChartWidth) {
  return prorataScale(mockupValue, currentChartWidth, RECTCHART_ORIGINAL_WIDTH);
}

const SQUAREDCHART_ORIGINAL_WIDTH = 258;
export function scaleSquaredChart(mockupValue, currentChartWidth) {
  return prorataScale(
    mockupValue,
    currentChartWidth,
    SQUAREDCHART_ORIGINAL_WIDTH
  );
}

export const wrap = function (text, lineHeight) {
  text.each(function () {
    const text = select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let lineNumber = 0;
    let line = [];
    const width = parseFloat(text.attr('width'));
    const y = parseFloat(text.attr('y'));
    const x = text.attr('x');
    const textAnchor = text.attr('text-anchor');
    let tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', textAnchor);

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        lineNumber++;
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y + lineNumber * lineHeight)
          .attr('text-anchor', textAnchor)
          .text(word);
      }
    }
  });
};

export function getCoordinates(value, radius, index) {
  const angle = Math.PI / 2 + (2 * Math.PI * -index) / HEXAGONAL_POINTS;
  const x = Math.cos(angle) * value;
  const y = Math.sin(angle) * value;
  return { x: radius + x, y: radius - y };
}

const HEXAGONAL_POINTS = 6;

export function getHexagonPoints(hexagonRadius, containerRadius) {
  const hexagonPoints = [];
  for (let i = 0; i < HEXAGONAL_POINTS; i++) {
    const coordinates = getCoordinates(hexagonRadius, containerRadius, i);
    hexagonPoints.push([coordinates.x, coordinates.y]);
  }

  return hexagonPoints;
}

export function pointsToPath(points) {
  return points.map((p) => p.join(',')).join(' ');
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');

  return d;
}
