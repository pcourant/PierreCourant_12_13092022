import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
import PropTypes from 'prop-types';
import {
  select,
  scaleLinear,
  extent,
  axisBottom,
  axisRight,
  format,
  line,
  curveCardinal,
} from 'd3';

const StyledSvg = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: #ff0000;
  border-radius: 5px;

  .title {
    font-size: 15px;
    font-weight: 500;
    line-height: 24px;
    fill: #ffffff;
  }

  .tick {
    color: #9b9eac;
    font-size: 12px;
    font-weight: 500;
  }

  .tooltipText {
    font-size: 8px;
    font-weight: 500;
  }
`;

const wrap = function (text) {
  text.each(function () {
    var text = select(this);
    var words = text.text().split(/\s+/).reverse();
    var lineHeight = 20;
    var width = parseFloat(text.attr('width'));
    var y = parseFloat(text.attr('y'));
    var x = text.attr('x');
    var anchor = text.attr('text-anchor');

    var tspan = text
      .text(null)
      .append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', anchor);
    var lineNumber = 0;
    var line = [];
    var word = words.pop();

    while (word) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        lineNumber += 1;
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y + lineNumber * lineHeight)
          .attr('anchor', anchor)
          .text(word);
      }
      word = words.pop();
    }
  });
};

const LineChart = (props) => {
  const title = props.title;
  const { width, height, lineWidth, lineHeight } = props.sizes;
  const margins = props.margins;
  const yTitleAndCaption = lineHeight / 2 + title.margins.top;
  const xAxisPadding = (width - margins.left - margins.right) / 7 / 2;
  console.log(xAxisPadding);
  const labels = props.labels;
  const data = props.data;

  const d3Container = useRef(null);

  useEffect(
    () => {
      if (data && d3Container.current) {
        const svg = select(d3Container.current);

        //********************* DATA PROCESSING *********************

        meanData = data.map((d, i) => {
          let sum = 0;
          for (let j = 0; j <= i; j++) {
            sum += data[j].y;
          }
          return { x: d.x, y: sum / (i + 1) };
        });
        console.log('data', data);
        console.log('meanData', meanData);

        const xValue = (d, i) => i;
        const yValue = (d, i) => d.y;

        const xExtent = extent(meanData, xValue);
        const yExtent = extent(meanData, yValue);

        const xScale = scaleLinear()
          .domain(extent(meanData, xValue))
          .range([
            margins.left - xAxisPadding,
            width - margins.right + xAxisPadding,
          ]);
        const yScale = scaleLinear()
          // .domain([0, yExtent[1]])
          .domain(yExtent)
          .range([height - margins.bottom, margins.top]);

        const marks = meanData.map((d, index) => ({
          x: xScale(xValue(d, index)),
          y: yScale(yValue(d)),
          p_x: d.x,
          p_y: yValue(d),
        }));

        console.log('marks', marks);

        //********************* DATA VISUALIZATION *********************

        // Darker background construction
        const darkerBackground = svg
          .append('rect')
          .attr('x', width)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', 'black')
          .attr('opacity', 0.1);

        // Mask construction
        const mask = svg.append('mask').attr('id', 'mask');
        mask
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', 'white')
          .attr('opacity', 0.5);
        const maskLighten = mask
          .append('rect')
          .attr('x', width)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', 'white')
          .attr('opacity', 1);

        // Title construction
        svg
          .append('text')
          .text(title.text)
          .attr('x', title.margins.left)
          .attr('y', yTitleAndCaption)
          .attr('width', 150)
          .attr('class', 'title')
          .attr('opacity', 0.5)
          .call(wrap);
        // .attr('mask', 'url(#mask)');

        // X axis construction
        const xAxisGenerator = axisBottom(xScale)
          .tickPadding(20)
          .tickFormat((d, i) => marks[i].p_x);

        const xAxis = svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height - margins.bottom})`)
          .call(xAxisGenerator);
        xAxis.selectAll('.domain').remove();
        xAxis.selectAll('.tick line').remove();
        xAxis
          .selectAll('.tick text')
          .attr('fill', 'white')
          .attr('opacity', 0.5);

        // Line construction
        // it generates horizantal and vertical lines for x and y axis
        const lineGenerator = line()
          .x((d) => d.x) //coordinates in pixels
          .y((d) => d.y) //coordinates in pixels
          .curve(curveCardinal);

        svg
          .append('path')
          .attr('class', 'path-line')
          .datum(marks)
          .attr('d', lineGenerator)
          .attr('fill', 'none')
          .attr('stroke', 'white')
          .attr('stroke-width', lineWidth)
          .attr('mask', 'url(#mask)');

        // Overlay construction
        const overlayCircleOuter = svg
          .append('circle')
          .attr('class', 'overlay')
          .attr('r', 9)
          .attr('fill', 'transparent');
        const overlayCircleInner = svg
          .append('circle')
          .attr('class', 'overlay')
          .attr('r', 4)
          .attr('fill', 'transparent');

        // Tooltip box construction
        const tooltip = svg.append('g').attr('opacity', 0);

        const tooltipRect = tooltip
          .append('rect')
          .attr('width', 39)
          .attr('height', 25)
          .attr('fill', 'white');

        const tooltipText = tooltip
          .append('text')
          .attr('class', 'tooltipText')
          .attr('x', 39 / 2)
          .attr('y', 25 / 2)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('fill', 'black');

        // Overylay and tooltip apparition
        const intervalWidth = xAxisPadding * 2;
        svg
          .selectAll('rect .bar')
          .data(marks)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', (d) => d.x - intervalWidth / 2)
          .attr('y', margins.top)
          .attr('width', intervalWidth)
          .attr('height', height - margins.top - margins.bottom)
          .style('fill', 'transparent')
          .on('mouseover', function (event, d) {
            console.log('d.x', d.x);
            darkerBackground.attr('x', d.x);
            maskLighten.attr('x', d.x);
            overlayCircleOuter
              .transition()
              .duration(200)
              .attr('cx', d.x)
              .attr('cy', d.y)
              .attr('fill', 'white')
              .attr('opacity', 0.1983);
            overlayCircleInner
              .transition()
              .duration(200)
              .attr('cx', d.x)
              .attr('cy', d.y)
              .attr('fill', 'white');

            const dx = d.x + 5 + 39 > width ? d.x - 5 - 39 : d.x + 5;
            tooltip.transition().duration(0).attr('opacity', 1);
            tooltipRect
              .transition()
              .duration(200)
              .attr('x', dx)
              .attr('y', d.y - 25 - 7 - 4);
            tooltipText
              .transition()
              .duration(200)
              .attr('x', dx + 39 / 2)
              .attr('y', d.y - 25 - 7 - 4 + 25 / 2)
              .text(`${Math.round(d.p_y).toFixed(0)}${labels.tooltipY}`);
          })
          .on('mouseout', function () {
            darkerBackground.attr('x', width);
            maskLighten.attr('x', width);
            overlayCircleOuter
              .transition()
              .duration(200)
              .attr('fill', 'transparent');
            overlayCircleInner
              .transition()
              .duration(200)
              .attr('fill', 'transparent');
            tooltip.transition().duration(200).attr('opacity', 0);
          });
      }
    },
    // Dependency array
    [props, d3Container.current]
  );

  return (
    <StyledSvg
      className="d3-component"
      width={width}
      height={height}
      ref={d3Container}
    />
  );
};

LineChart.propTypes = {};

export default LineChart;
