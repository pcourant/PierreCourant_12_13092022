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
    var text = select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      lineNumber = 0,
      line = [],
      width = parseFloat(text.attr('width')),
      y = parseFloat(text.attr('y')),
      x = text.attr('x'),
      textAnchor = text.attr('text-anchor');
    tspan = text
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
