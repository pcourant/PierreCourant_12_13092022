import React, { useRef, useEffect } from 'react';
import { useUpdateWidth } from '../../utils/hooks';
import { RECT_DIMENSION_RATIO, scaleRectChart } from '../../utils/charts';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';
import { select, scaleLinear, extent, axisBottom, axisRight, format } from 'd3';

const ChartContainer = styled.div`
  width: 100%;
`;

const StyledBarChart = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: ${colors.backgroundLight};
  border-radius: 5px;

  #title {
    font-weight: 500;
    fill: #20253a;
  }

  .y1Caption circle {
    fill: #20253a;
  }
  .y2Caption circle {
    fill: #e60000;
  }
  .y1Caption text,
  .y2Caption text {
    fill: #74798c;
    font-weight: 500;
  }

  .x-axis {
    color: #dedede;
  }

  .tick {
    color: #9b9eac;
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

  #overlay {
    fill: #c4c4c4;
  }

  #tooltip {
    & rect {
      fill: red;
    }
    & text {
      font-size: 7px;
      font-weight: 500;
      fill: white;
    }
  }
`;

const BarChart = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const width = useUpdateWidth(chartContainerRef);

  useEffect(
    () => {
      if (chartRef.current) {
        const height = width * RECT_DIMENSION_RATIO;
        const svg = select(chartRef.current);
        svg.attr('height', height);

        //********************* DIMENSION PROCESSING *********************

        const labels = props.labels;
        const data = props.data;

        const title = {
          text: props.title,
          fontSize: scaleRectChart(15, width),
          lineHeight: scaleRectChart(24, width),
          margin: {
            top: scaleRectChart(24, width),
            left: scaleRectChart(32, width),
          },
        };
        const margin = {
          top: scaleRectChart(112.5, width),
          right: scaleRectChart(90, width),
          bottom: scaleRectChart(62.5, width),
          left: scaleRectChart(43, width),
        };
        const xAxisPadding = {
          top: scaleRectChart(100, width),
          side: scaleRectChart(11, width),
        };
        const barsGap = scaleRectChart(9, width);
        const barWidth = scaleRectChart(7, width);
        const barCap = scaleRectChart(3, width);
        const captionRadius = scaleRectChart(4, width);
        const caption1 = {
          point: 0.642 * width,
          text: 0.658 * width,
          fontSize: scaleRectChart(14, width),
          lineHeight: scaleRectChart(24, width),
        };
        const caption2 = {
          point: 0.778 * width,
          text: 0.797 * width,
          fontSize: scaleRectChart(14, width),
          lineHeight: scaleRectChart(24, width),
        };
        const overlay = {
          y: margin.top - 1,
          width: scaleRectChart(56, width),
          height: height - margin.top - margin.bottom + 1,
        };
        const tick = {
          xAxisPadding: scaleRectChart(16, width),
          yAxisPadding: scaleRectChart(45, width),
        };
        const tooltip = {
          offset: scaleRectChart(7, width),
          width: 40,
          height: 64,
        };

        //********************* DATA PROCESSING *********************
        const xValue = (d) => d.x;
        const y1Value = (d) => d.y1;
        const y2Value = (d) => d.y2;

        const y1Extent = extent(data, y1Value);
        const y1MinFloor = Math.floor(y1Extent[0]);
        const y1Min = y1MinFloor === y1Extent[0] ? y1MinFloor - 1 : y1MinFloor;
        const y1Max = Math.ceil(y1Extent[1]);

        const y2Extent = extent(data, y2Value);

        const xScale = scaleLinear()
          .domain(extent(data, xValue))
          .range([
            margin.left + xAxisPadding.side,
            width - margin.right - xAxisPadding.side,
          ]);
        const y1Scale = scaleLinear()
          .domain([y1Min, y1Max])
          .range([height - margin.bottom, margin.top]);
        const y2Scale = scaleLinear()
          .domain([0, y2Extent[1]])
          .range([height - margin.bottom, margin.top]);

        const marks = data.map((d) => ({
          x: xScale(xValue(d)),
          y1: y1Scale(y1Value(d)),
          y2: y2Scale(y2Value(d)),
          y1Value: y1Value(d),
          y2Value: y2Value(d),
        }));

        //********************* CHART CONSTRUCTION *********************

        // Overlay
        const overlayRect = svg
          .append('rect')
          .attr('id', 'overlay')
          .attr('y', overlay.y)
          .attr('width', overlay.width)
          .attr('height', overlay.height)
          .attr('opacity', 0);

        // Title
        svg
          .append('text')
          .text(title.text)
          .attr('x', title.margin.left)
          .attr('y', title.margin.top)
          .attr('dominant-baseline', 'hanging')
          .attr('font-size', `${title.fontSize}px`)
          .attr('line-height', `${title.lineHeight}px`)
          .attr('id', 'title');

        // Captions
        const y1Caption = svg.append('g').attr('class', '  y1Caption');
        y1Caption
          .append('circle')
          .attr('cx', caption1.point)
          .attr('cy', title.margin.top + caption1.fontSize / 2) // 14 is 14px the font-size of caption text
          .attr('r', captionRadius);
        y1Caption
          .append('text')
          .text(labels.y1)
          .attr('x', caption1.text)
          .attr('y', title.margin.top)
          .attr('dominant-baseline', 'hanging')
          .attr('font-size', `${caption1.fontSize}px`)
          .attr('line-height', `${caption1.lineHeight}px`);

        const y2Caption = svg.append('g').attr('class', 'y2Caption');
        y2Caption
          .append('circle')
          .attr('cx', caption2.point)
          .attr('cy', title.margin.top + caption2.fontSize / 2) // 14 is 14px the font-size of caption text
          .attr('r', captionRadius);
        y2Caption
          .append('text')
          .text(labels.y2)
          .attr('x', caption2.text)
          .attr('y', title.margin.top)
          .attr('dominant-baseline', 'hanging')
          .attr('font-size', `${caption2.fontSize}px`)
          .attr('line-height', `${caption2.lineHeight}px`);

        // Y1 axis construction
        const y1AxisTicks = y1Scale
          .ticks()
          .filter((tick) => Number.isInteger(tick));

        const y1AxisGenerator = axisRight(y1Scale)
          .tickPadding(tick.yAxisPadding)
          .tickSize(-(width - margin.left - margin.right))
          .tickValues(y1AxisTicks)
          .tickFormat(format('d'));

        const y1Axis = svg
          .append('g')
          .attr('class', 'y1-axis')
          .attr('transform', `translate(${width - margin.right},0)`)
          .call(y1AxisGenerator);

        y1Axis.selectAll('.domain').remove();
        y1Axis.selectAll('.tick line').attr('stroke-width', '1');
        y1Axis.selectAll('.tick line').attr('stroke-dasharray', '2');
        y1Axis.select('.tick line').attr('stroke-dasharray', null);

        // X axis construction
        const xAxisTicks = xScale
          .ticks()
          .filter((tick) => Number.isInteger(tick));

        const xAxisGenerator = axisBottom(xScale)
          .tickPadding(tick.xAxisPadding)
          .tickValues(xAxisTicks)
          .tickFormat(format('d'));

        const xAxis = svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(xAxisGenerator);

        xAxis.selectAll('.domain').remove();
        xAxis.selectAll('.tick line').remove();

        // Marker for bar round cap
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

        //********************* PLOTTING DATA *********************

        // Y1 Bars/lines
        svg
          .selectAll('line .y1-line')
          .data(marks)
          .join('line')
          .attr('class', 'y1-line')
          .attr('x1', (d) => d.x - (barsGap / 2 + barWidth / 2))
          .attr('x2', (d) => d.x - (barsGap / 2 + barWidth / 2))
          .attr('y1', height - margin.bottom)
          .attr('y2', (d) => d.y1 + barCap)
          .attr('stroke-width', barWidth)
          .attr('marker-end', 'url(#y1-marker)');

        // y2 lines construction
        svg
          .selectAll('line .y2-line')
          .data(marks)
          .join('line')
          .attr('class', 'y2-line')
          .attr('x1', (d) => d.x + (barsGap / 2 + barWidth / 2))
          .attr('x2', (d) => d.x + (barsGap / 2 + barWidth / 2))
          .attr('y1', height - margin.bottom)
          .attr('y2', (d) => d.y2 + barCap)
          .attr('stroke-width', barWidth)
          .attr('marker-end', 'url(#y2-marker)');

        //********************* TOOLTIP AND OVERLAY  *********************
        // Tooltip box construction
        const tooltipG = svg
          .append('g')
          .attr('opacity', 0)
          .attr('id', 'tooltip');
        const tooltipRect = tooltipG
          .append('rect')
          .attr('width', tooltip.width)
          .attr('height', tooltip.height);
        const tooltipY1 = tooltipG
          .append('text')
          .attr('class', 'tooltipText')
          .attr('x', tooltip.width / 2)
          .attr('y', tooltip.height / 4)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle');
        const tooltipY2 = tooltipG
          .append('text')
          .attr('class', 'tooltipText')
          .attr('x', tooltip.width / 2)
          .attr('y', (tooltip.height / 4) * 3)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle');

        // MOUSE OVER => Overlay and tooltip apparition
        svg
          .selectAll('rect .bar')
          .data(marks)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', (d) => d.x - overlay.width / 2)
          .attr('y', margin.top)
          .attr('width', overlay.width)
          .attr('height', height - margin.top - margin.bottom)
          .style('fill', 'transparent')
          .on('mouseover', (event, d) => {
            overlayRect
              .transition()
              .duration(0)
              .attr('x', d.x - overlay.width / 2)
              .attr('opacity', 0.5);

            tooltipG.transition().duration(0).attr('opacity', 1);

            const dx =
              d.x + overlay.width / 2 + tooltip.offset + tooltip.width >
              width - margin.right
                ? d.x - overlay.width / 2 - tooltip.offset - tooltip.width
                : d.x + overlay.width / 2 + tooltip.offset;

            tooltipRect
              .transition()
              .duration(0)
              .attr('x', dx)
              .attr('y', margin.top - tooltip.height / 2);

            tooltipY1
              .transition()
              .duration(0)
              .attr('x', dx + tooltip.width / 2)
              .attr(
                'y',
                margin.top - tooltip.height / 2 + (tooltip.height / 4) * 1
              )
              .text(`${d.y1Value}${labels.tooltipY1}`);

            tooltipY2
              .transition()
              .duration(0)
              .attr('x', dx + tooltip.width / 2)
              .attr(
                'y',
                margin.top - tooltip.height / 2 + (tooltip.height / 4) * 3
              )
              .text(`${d.y2Value}${labels.tooltipY2}`);
          })
          // MOUSE OUT => Overlay and tooltip desapparition
          .on('mouseout', () => {
            overlayRect.transition().duration(200).attr('opacity', 0);
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
      <StyledBarChart width={'100%'} ref={chartRef} />
    </ChartContainer>
  );
};

BarChart.propTypes = {};

export default BarChart;
