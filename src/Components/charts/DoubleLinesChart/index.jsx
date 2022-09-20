import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../../utils/colors';
import PropTypes from 'prop-types';
import { select, scaleLinear, extent, axisBottom, axisRight, format } from 'd3';

const StyledSvg = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: ${colors.backgroundLight};

  .title {
    font-size: 15px;
    font-weight: 500;
    line-height: 24px;
    fill: #20253a;
  }

  .caption1 circle {
    fill: #20253a;
  }
  .caption2 circle {
    fill: #e60000;
  }
  .caption1 text,
  .caption2 text {
    fill: #74798c;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
  }

  .x-axis {
    color: #dedede;
  }

  .tick {
    color: #9b9eac;
    /* color: #dedede; */
    font-size: 14px;
    font-weight: 500;

    & line {
      color: #dedede;
    }
  }

  .y1-line {
    stroke: #282d30;
  }
  #y1-marker {
    fill: #282d30;
  }
  .y2-line {
    stroke: #e60000;
    fill: #e60000;
  }
  #y2-marker {
    fill: #e60000;
  }

  .tooltipText {
    font-size: 7px;
    font-weight: 500;
  }
`;

const DoubleLinesChart = (props) => {
  const title = props.title;
  const { width, height, lineWidth, lineHeight } = props.sizes;
  const margins = props.margins;
  const { xAxisPadding, linePadding } = props.paddings;
  const yTitleAndCaption = lineHeight / 2 + title.margins.top;
  const labels = props.labels;
  const data = props.data;

  const d3Container = useRef(null);

  useEffect(
    () => {
      if (data && d3Container.current) {
        const svg = select(d3Container.current);

        //********************* DATA PROCESSING *********************
        const xValue = (d) => d.x;
        const y1Value = (d) => d.y1;
        const y2Value = (d) => d.y2;

        const y1Extent = extent(data, y1Value);
        const y1MinFloor = Math.floor(y1Extent[0]);
        const y1Min = y1MinFloor === y1Extent[0] ? y1MinFloor - 1 : y1MinFloor;
        const y1Max = Math.ceil(y1Extent[1]);

        const y2Extent = extent(data, y2Value);
        console.log('y2Extent', y2Extent);

        const xScale = scaleLinear()
          .domain(extent(data, xValue))
          .range([
            margins.left + xAxisPadding,
            width - margins.right - xAxisPadding,
          ]);
        const y1Scale = scaleLinear()
          .domain([y1Min, y1Max])
          .range([height - margins.bottom, margins.top]);
        const y2Scale = scaleLinear()
          .domain([0, y2Extent[1]])
          .range([height - margins.bottom, margins.top]);

        const marks = data.map((d) => ({
          x: xScale(xValue(d)),
          y1: y1Scale(y1Value(d)),
          y2: y2Scale(y2Value(d)),
          p_x: xValue(d),
          p_y1: y1Value(d),
          p_y2: y2Value(d),
        }));

        //********************* DATA VISUALIZATION *********************

        // Title construction
        svg
          .append('text')
          .text(title.text)
          .attr('x', title.margins.left)
          .attr('y', yTitleAndCaption)
          .attr('class', 'title');

        // Captions construction
        const captionRadius = 4;
        const caption1 = svg.append('g').attr('class', 'caption1');
        caption1
          .append('circle')
          .attr('cx', width * 0.637)
          .attr('cy', yTitleAndCaption - captionRadius)
          .attr('r', captionRadius);
        caption1
          .append('text')
          .text(labels.y1)
          .attr('x', width * 0.637 + captionRadius / 2 + 10)
          .attr('y', yTitleAndCaption);

        const caption2 = svg.append('g').attr('class', 'caption2');
        caption2
          .append('circle')
          .attr('cx', width * 0.773)
          .attr('cy', yTitleAndCaption - captionRadius)
          .attr('r', captionRadius);
        caption2
          .append('text')
          .text(labels.y2)
          .attr('x', width * 0.773 + captionRadius / 2 + 10)
          .attr('y', yTitleAndCaption);

        // Overlay construction
        const overlay = svg
          .append('rect')
          .attr('class', 'overlay')
          .attr('opacity', 0.5)
          .attr('width', 50)
          .attr('height', height - margins.top - margins.bottom)
          .attr('fill', 'transparent');

        // Y1 axis construction
        const y1AxisTicks = y1Scale
          .ticks()
          .filter((tick) => Number.isInteger(tick));

        const y1AxisGenerator = axisRight(y1Scale)
          .tickPadding(45)
          .tickSize(-(width - margins.left - margins.right))
          .tickValues(y1AxisTicks)
          .tickFormat(format('d'));

        const y1Axis = svg
          .append('g')
          .attr('class', 'y1-axis')
          .attr('transform', `translate(${width - margins.right},0)`)
          .call(y1AxisGenerator);

        y1Axis.selectAll('.domain').remove();
        y1Axis.selectAll('.tick line').attr('stroke-width', '1');
        y1Axis.selectAll('.tick line').attr('stroke-dasharray', '2');
        y1Axis.select('.tick line').attr('stroke-dasharray', null);

        // X axis construction
        const xAxisGenerator = axisBottom(xScale).tickPadding(16);

        const xAxis = svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height - margins.bottom})`)
          .call(xAxisGenerator);

        xAxis.selectAll('.domain').remove();
        xAxis.selectAll('.tick line').remove();

        // Marker for line construction
        svg
          .append('defs')
          .append('marker')
          .attr('id', 'y1-marker')
          .attr('viewBox', '-1 -1 2 2')
          .attr('markerWidth', 1)
          .attr('orient', 'auto')
          .append('circle')
          .attr('r', 1);
        svg
          .append('defs')
          .append('marker')
          .attr('id', 'y2-marker')
          .attr('viewBox', '-1 -1 2 2')
          .attr('markerWidth', 1)
          .attr('orient', 'auto')
          .append('circle')
          .attr('r', 1);

        // y1 lines construction
        svg
          .selectAll('line .y1-line')
          .data(marks)
          .join('line')
          .attr('class', 'y1-line')
          .attr('x1', (d) => d.x - (linePadding / 2 + lineWidth / 2))
          .attr('x2', (d) => d.x - (linePadding / 2 + lineWidth / 2))
          .attr('y1', height - margins.bottom)
          .attr('y2', (d) => d.y1 + 3)
          .attr('stroke-width', lineWidth)
          .attr('marker-end', 'url(#y1-marker)')
          .append('title')
          .text((d) => `( ${d.p_x}, ${d.p_y1} )`);

        // y2 lines construction
        svg
          .selectAll('line .y2-line')
          .data(marks)
          .join('line')
          .attr('class', 'y2-line')
          .attr('x1', (d) => d.x + (linePadding / 2 + lineWidth / 2))
          .attr('x2', (d) => d.x + (linePadding / 2 + lineWidth / 2))
          .attr('y1', height - margins.bottom)
          .attr('y2', (d) => d.y2 + 3)
          .attr('stroke-width', lineWidth)
          .attr('marker-end', 'url(#y2-marker)')
          .append('title')
          .text((d) => `( ${d.p_x}, ${d.p_y2} )`);

        // Tooltip box construction
        const tooltip = svg.append('g').attr('opacity', 0);

        const tooltipRect = tooltip
          .append('rect')
          .attr('width', 40)
          .attr('height', 64)
          .attr('fill', 'red');

        const tooltipY1 = tooltip
          .append('text')
          .attr('class', 'tooltipText')
          .attr('x', 40 / 2)
          .attr('y', 64 / 4)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white');

        const tooltipY2 = tooltip
          .append('text')
          .attr('class', 'tooltipText')
          .attr('x', 40 / 2)
          .attr('y', (64 / 4) * 3)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white');

        // Overylay and tooltip apparition
        svg
          .selectAll('rect .bar')
          .data(marks)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', (d) => d.x - 25)
          .attr('y', margins.top)
          .attr('width', 50)
          .attr('height', height - margins.top - margins.bottom)
          .style('fill', 'transparent')
          .on('mouseover', function (event, d) {
            overlay
              .transition()
              .duration(0)
              .attr('x', d.x - 25)
              .attr('y', margins.top)
              .attr('fill', '#C4C4C4');

            tooltip.transition().duration(0).attr('opacity', 1);

            tooltipRect
              .transition()
              .duration(0)
              .attr('x', d.x - 25 + 57)
              .attr('y', margins.top - 64 / 2);

            tooltipY1
              .transition()
              .duration(0)
              .attr('x', d.x - 25 + 57 + 40 / 2)
              .attr('y', margins.top - 64 / 2 + (64 / 4) * 1)
              .text(`${d.p_y1}${labels.tooltipY1}`);

            tooltipY2
              .transition()
              .duration(0)
              .attr('x', d.x - 25 + 57 + 40 / 2)
              .attr('y', margins.top - 64 / 2 + (64 / 4) * 3)
              .text(`${d.p_y2}${labels.tooltipY2}`);
          })
          .on('mouseout', function () {
            overlay.transition().duration(200).attr('fill', 'transparent');
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

DoubleLinesChart.propTypes = {};

export default DoubleLinesChart;
