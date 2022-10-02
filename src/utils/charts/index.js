import { select } from 'd3';

// Constants from figma mockups
export const RECT_DIMENSION_RATIO = 0.383;
export const SQUARE_DIMENSION_RATIO = 1.0194;
export const KEYINFO_DIMENSION_RATIO = 0.4806;
export const SIDEBAR_DIMENSION_RATIO = 0.4806;

/**
 * Scale the mockup value to the current chart width
 * @param {Number} mockupValue
 * @param {Number} currentChartWidth
 * @param {Number} mockupChartWidth
 * @returns {Number} the scaled value
 */
export function prorataScale(mockupValue, currentChartWidth, mockupChartWidth) {
  return (currentChartWidth * mockupValue) / mockupChartWidth;
}

const WINDOW_ORIGINAL_WIDTH = 1440;
/**
 * Scale the mockup value to the window width
 * @param {Number} mockupValue
 * @param {Number} windowCurrentWidth
 * @returns {Number} the scaled value
 */
export function prorataWindowScale(mockupValue, windowCurrentWidth) {
  return prorataScale(mockupValue, windowCurrentWidth, WINDOW_ORIGINAL_WIDTH);
}

const RECTCHART_ORIGINAL_WIDTH = 835;
/**
 * Scale the mockup value to the rectangle chart width
 * @param {Number} mockupValue
 * @param {Number} currentChartWidth - the rectangle chart width
 * @returns {Number} the scaled value
 */
export function scaleRectChart(mockupValue, currentChartWidth) {
  return prorataScale(mockupValue, currentChartWidth, RECTCHART_ORIGINAL_WIDTH);
}

const SPAN1_CHART_ORIGINAL_WIDTH = 258;
/**
 * Scale the mockup value to the chart width
 * @param {Number} mockupValue
 * @param {Number} currentChartWidth - the chart width
 * @returns {Number} the scaled value
 */
export function scale1spanChart(mockupValue, currentChartWidth) {
  return prorataScale(
    mockupValue,
    currentChartWidth,
    SPAN1_CHART_ORIGINAL_WIDTH
  );
}

/**
 * Wrap a SVG <text> element in multiple lines if necessary
 * @param {SVG <text> element} textSVG - an SVG <text> element to be wrapped
 * @param {Number} lineHeight - the height of the text lines
 */
export const wrap = function (textSVG, lineHeight) {
  textSVG.each(function () {
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

/**
 * Get the coordinates in the hexagon of the value
 * @param {Number} value - the value to get the coordinates from
 * @param {Number} radius - the radius of the hexagon
 * @param {Number<0-6>} index - a corner of the hexagon
 * @returns {Object.<x: Number, y: Number>} - coordinates of the value
 */
export function getCoordinates(value, radius, index) {
  const angle = Math.PI / 2 + (2 * Math.PI * -index) / HEXAGONAL_POINTS;
  const x = Math.cos(angle) * value;
  const y = Math.sin(angle) * value;
  return { x: radius + x, y: radius - y };
}

const HEXAGONAL_POINTS = 6;

/**
 * Get the coordinates of the 6 points of an hexagon of a specified radius
 * @param {Number} hexagonRadius - the radius of the current hexagon
 * @param {Number} containerRadius - the radius of the biggest hexagon
 * @returns {Array.<Number[]>}
 */
export function getHexagonPoints(hexagonRadius, containerRadius) {
  const hexagonPoints = [];
  for (let i = 0; i < HEXAGONAL_POINTS; i++) {
    const coordinates = getCoordinates(hexagonRadius, containerRadius, i);
    hexagonPoints.push([coordinates.x, coordinates.y]);
  }

  return hexagonPoints;
}

/**
 * Transform points coordinates to a String for an SVG <polygon> 'points' attribute
 * @param {Array.<Number[]>} points - coordinates of all points
 * @returns {String}
 */
export function pointsToPath(points) {
  return points?.map((p) => p.join(',')).join(' ');
}

/**
 * Transform the polar coordinates to a cartesian coordinates
 * @param {Number} centerX
 * @param {Number} centerY
 * @param {Number} radius
 * @param {Number} angleInDegrees
 * @returns {Object.<x: Number, y: Number>}
 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Construct the 'd' attribute of a SVG path element to draw an arc
 * @param {Number} cx - x coordinate of the center of the circle
 * @param {Number} cy - x coordinate of the center of the circle
 * @param {Number} radius - the radius of the circle
 * @param {Number} startAngle - angle to start the arc
 * @param {Number} endAngle - angle to end the arc
 * @returns {String} - the 'd' attribute to draw the arc in a SVG path element
 */
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

/**
 * Format the user performance data
 * @param {Array.<{value: Number, kind: Integer}>} data
 * @param {Object.<1: String, 2: String, 3: String, 4: String, 5: String, 6: String>} kind
 * @returns {Number[]}
 */
export function formatPerformanceData(data, kind) {
  if (data && kind) {
    const dataSorted = [
      'intensity',
      'speed',
      'strength',
      'endurance',
      'energy',
      'cardio',
    ];
    for (const [key, k] of Object.entries(kind)) {
      const value = data.find((obj) => obj.kind === +key)?.value;

      if (value !== undefined) {
        const index = dataSorted.indexOf(k);
        if (index > -1) {
          dataSorted[index] = value;
        }
      }
    }
    return dataSorted;
  }
}

/**
 * Format the user activity data
 * @param {Array.<{day: String, kilogram: Number, calories: Number}>} data
 * @returns {Array.<{x: Number, y1: Number, y2: Number}>}
 */
export function formatActivityData(data) {
  return data?.map((activity) => ({
    x: new Date(activity?.day).getDate(),
    y1: activity?.kilogram,
    y2: activity?.calories,
  }));
}

/**
 * Format the user average sessions data
 * @param {Array.<{day: Integer, sessionLength: Number}>} sessions
 * @returns {Array.<xTick: String, value: Number>}
 */
export function formatAverageSessionsData(sessions) {
  const dayOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const result = sessions?.map((session) => ({
    xTick: dayOfWeek[session?.day % 7],
    value: session?.sessionLength,
  }));

  if (result?.length < 9) {
    result.unshift(result[0]);
  }
  if (result?.length < 9) {
    result.push(result[result.length - 1]);
  }

  return result;
}
