import React, { useRef, useEffect } from 'react';
import { useUpdateWidth } from '../../utils/hooks';
import {
  SQUARE_DIMENSION_RATIO,
  scaleSquaredChart,
  wrap,
} from '../../utils/charts';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';
import {
  max,
  select,
  scaleLinear,
  extent,
  axisBottom,
  line,
  curveCardinal,
} from 'd3';

const ChartContainer = styled.div`
  width: 100%;
`;

const StyledLineChart = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: #ff0000;
  border-radius: 5px;

  .title {
    font-weight: 500;
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

const LineChart = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const width = useUpdateWidth(chartContainerRef);

  useEffect(
    () => {
      if (chartRef.current) {
        const height = width * SQUARE_DIMENSION_RATIO;
        const svg = select(chartRef.current);
        svg.attr('height', height);

        //********************* DIMENSION PROCESSING *********************
        const labels = props.labels;
        const data = props.data;

        const title = {
          text: props.title,
          fontSize: scaleSquaredChart(15, width),
          lineHeight: scaleSquaredChart(24, width),
          margin: {
            top: scaleSquaredChart(29, width),
            left: scaleSquaredChart(34, width),
          },
          width: scaleSquaredChart(150, width),
        };
        const margin = {
          top: scaleSquaredChart(77, width),
          right: scaleSquaredChart(0, width),
          bottom: scaleSquaredChart(60, width),
          left: scaleSquaredChart(0, width),
        };
        const xAxisPadding = {
          top: 0,
          side: (width - margin.left - margin.right) / 7 / 2,
        };
        const tick = {
          xAxisPadding: scaleSquaredChart(20, width),
          labels: ['D', 'L', 'M', 'M', 'J', 'V', 'S', 'D', 'L'],
        };
        const point = {
          innerCircle: 4,
          outerCircle: 9,
        };
        const lineWidth = scaleSquaredChart(2, width);
        const tooltip = {
          offset: {
            x: scaleSquaredChart(5, width),
            y: scaleSquaredChart(7, width),
          },
          width: 39,
          height: 25,
        };

        //********************* DATA PROCESSING *********************

        // meanData = data.map((d, i) => {
        //   let sum = 0;
        //   for (let j = 0; j <= i; j++) {
        //     sum += data[j].y;
        //   }
        //   return { x: d.x, y: sum / (i + 1) };
        // });
        // console.log('meanData', meanData);

        const xValue = (d, i) => i;
        const yValue = (d) => d;

        const xExtent = [0, data.length - 1];
        const yExtent = [0, max(data)];

        const xScale = scaleLinear()
          .domain(xExtent)
          .range([
            margin.left - xAxisPadding.side,
            width - margin.right + xAxisPadding.side,
          ]);
        const yScale = scaleLinear()
          .domain(yExtent)
          .range([height - margin.bottom, margin.top]);

        const marks = data.map((d, i) => ({
          x: xScale(xValue(d, i)),
          y: yScale(yValue(d, i)),
          yValue: yValue(d),
        }));

        //********************* CHART CONSTRUCTION *********************
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
          .attr('x', title.margin.left)
          .attr('y', title.margin.top)
          .attr('dominant-baseline', 'hanging')
          .attr('width', title.width)
          .attr('class', 'title')
          .attr('font-size', `${title.fontSize}px`)
          .attr('line-height', `${title.lineHeight}px`)
          .attr('opacity', 0.5)
          .call(wrap, title.lineHeight);

        // X axis construction
        const xAxisGenerator = axisBottom(xScale)
          .tickPadding(tick.xAxisPadding)
          .tickFormat((d, i) => tick.labels[i]);

        const xAxis = svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(xAxisGenerator);
        xAxis.selectAll('.domain').remove();
        xAxis.selectAll('.tick line').remove();
        xAxis
          .selectAll('.tick text')
          .attr('fill', 'white')
          .attr('opacity', 0.5);

        //********************* PLOTTING DATA *********************
        // Line construction
        const lineGenerator = line()
          .x((d) => d.x) //coordinates in pixels
          .y((d) => d.y) //coordinates in pixels
          .curve(curveCardinal);

        svg
          .datum(marks)
          .append('path')
          .attr('class', 'path-line')
          .attr('d', lineGenerator)
          .attr('fill', 'none')
          .attr('stroke', 'white')
          .attr('stroke-width', lineWidth)
          .attr('mask', 'url(#mask)');

        // Overlay construction
        const overlayCircleOuter = svg
          .append('circle')
          .attr('class', 'overlay')
          .attr('r', point.outerCircle)
          .attr('fill', 'transparent');
        const overlayCircleInner = svg
          .append('circle')
          .attr('class', 'overlay')
          .attr('r', point.innerCircle)
          .attr('fill', 'transparent');

        // Tooltip box construction
        const tooltipG = svg.append('g').attr('opacity', 0);

        const tooltipRect = tooltipG
          .append('rect')
          .attr('width', tooltip.width)
          .attr('height', tooltip.height)
          .attr('fill', 'white');

        const tooltipText = tooltipG
          .append('text')
          .attr('class', 'tooltipText')
          .attr('x', tooltip.width / 2)
          .attr('y', tooltip.height / 2)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('fill', 'black');

        //********************* TOOLTIP AND OVERLAY  *********************
        const intervalWidth = xAxisPadding.side * 2;
        svg
          .selectAll('rect .bar')
          .data(marks)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', (d) => d.x - intervalWidth / 2)
          .attr('y', margin.top)
          .attr('width', intervalWidth)
          .attr('height', height - margin.top - margin.bottom)
          .style('fill', 'transparent')
          .on('mouseover', function (event, d) {
            darkerBackground.transition().duration(200).attr('x', d.x);
            maskLighten.transition().duration(200).attr('x', d.x);
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

            const dx =
              d.x + tooltip.offset.x + tooltip.width > width
                ? d.x - tooltip.offset.x - tooltip.width
                : d.x + tooltip.offset.x;
            tooltipG.transition().duration(0).attr('opacity', 1);
            tooltipRect
              .transition()
              .duration(200)
              .attr('x', dx)
              .attr(
                'y',
                d.y - tooltip.height - tooltip.offset.y - point.innerCircle / 2
              );
            tooltipText
              .transition()
              .duration(200)
              .attr('x', dx + tooltip.width / 2)
              .attr(
                'y',
                d.y -
                  tooltip.height -
                  tooltip.offset.y -
                  point.innerCircle / 2 +
                  tooltip.height / 2
              )
              .text(`${Math.round(d.yValue).toFixed(0)}${labels.tooltipY}`);
          })
          .on('mouseout', function () {
            darkerBackground.transition().duration(200).attr('x', width);
            maskLighten.transition().duration(200).attr('x', width);
            overlayCircleOuter
              .transition()
              .duration(200)
              .attr('fill', 'transparent');
            overlayCircleInner
              .transition()
              .duration(200)
              .attr('fill', 'transparent');
            tooltipG.transition().duration(200).attr('opacity', 0);
          });
      }

      return () => {
        // Delete the entire chart
        while (chartRef.current.firstChild) {
          chartRef.current.removeChild(chartRef.current.firstChild);
        }
      };
    },
    // Dependency array
    [props, width]
  );

  return (
    <ChartContainer ref={chartContainerRef}>
      <StyledLineChart width={'100%'} ref={chartRef} />
    </ChartContainer>
  );
};

LineChart.propTypes = {};

export default LineChart;
