import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
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

// Constants from figma mockups
const ratio = 0.383;
const barChartWidth = 835;
const barChartHeight = 320;

function prorataWidth(mockupValue, mockupWidth, currentWidth) {
  return (currentWidth * mockupValue) / mockupWidth;
}
function prorataHeight(mockupValue, mockupHeight, currentHeight) {
  return (currentHeight * mockupValue) / mockupHeight;
}

const BarChart = (props) => {
  const title = props.title;
  const labels = props.labels;
  const data = props.data;

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function updateWidth() {
      setWidth(chartContainerRef.current.offsetWidth);
    }
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(
    () => {
      if (chartContainerRef.current) {
        setWidth(chartContainerRef.current.offsetWidth);
        if (!width) return;
      }

      if (chartRef.current) {
        const height = width * ratio;
        const svg = select(chartRef.current);
        svg.attr('height', height);

        //********************* DIMENSION PROCESSING *********************

        const titleMargin = {
          top: 24,
          left: 32,
        };
        const lineHeight = 24;
        const yTitle = titleMargin.top + lineHeight / 2;
        const margin = {
          top: prorataHeight(112.5, barChartHeight, height),
          right: prorataWidth(90, barChartWidth, width),
          bottom: prorataHeight(62.5, barChartHeight, height),
          left: prorataWidth(43, barChartWidth, width),
        };
        const xAxisPadding = {
          top: prorataHeight(100, barChartHeight, height),
          side: prorataWidth(11, barChartWidth, width),
        };
        const barsGap = prorataWidth(9, barChartWidth, width);
        const barWidth = prorataWidth(7, barChartWidth, width);
        const barCap = prorataHeight(3, barChartHeight, height);
        const captionRadius = 4;
        const xCaption1 = {
          point: width - 295,
          text: width - 295 + 10 + captionRadius,
        };
        const xCaption2 = {
          point: width - 181,
          text: width - 181 + 10 + captionRadius,
        };
        const overlay = {
          offset: prorataWidth(25, barChartWidth, width),
          y: margin.top - 1,
          width: prorataWidth(50, barChartWidth, width),
          height: height - margin.top - margin.bottom + 1,
        };
        const tick = {
          xAxisPadding: prorataHeight(16, barChartHeight, height),
          yAxisPadding: prorataWidth(45, barChartWidth, width),
        };
        const tooltip = {
          offset: prorataWidth(57, barChartWidth, width),
          width: prorataWidth(40, barChartWidth, width),
          height: prorataHeight(64, barChartHeight, height),
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
        }));

        //********************* CHART CONSTRUCTION *********************

        // Title
        svg
          .append('text')
          .text(title)
          .attr('x', titleMargin.left)
          .attr('y', yTitle)
          .attr('id', 'title');

        // Captions
        const caption1 = svg.append('g').attr('class', 'caption1');
        caption1
          .append('circle')
          .attr('cx', xCaption1.point)
          .attr('cy', yTitle - captionRadius)
          .attr('r', captionRadius);
        caption1
          .append('text')
          .text(labels.y1)
          .attr('x', xCaption1.text)
          .attr('y', yTitle);

        const caption2 = svg.append('g').attr('class', 'caption2');
        caption2
          .append('circle')
          .attr('cx', xCaption2.point)
          .attr('cy', yTitle - captionRadius)
          .attr('r', captionRadius);
        caption2
          .append('text')
          .text(labels.y2)
          .attr('x', xCaption2.text)
          .attr('y', yTitle);

        // Overlay
        const overlayRect = svg
          .append('rect')
          .attr('id', 'overlay')
          .attr('y', overlay.y)
          .attr('width', overlay.width)
          .attr('height', overlay.height)
          .attr('opacity', 0);

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
        const xAxisGenerator = axisBottom(xScale).tickPadding(
          tick.xAxisPadding
        );
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

        //********************* ANIMATION *********************
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
          .attr('x', (d) => d.x - overlay.offset)
          .attr('y', margin.top)
          .attr('width', 50)
          .attr('height', height - margin.top - margin.bottom)
          .style('fill', 'transparent')
          .on('mouseover', function (event, d) {
            overlayRect
              .transition()
              .duration(0)
              .attr('x', d.x - overlay.offset)
              .attr('opacity', 0.5);

            tooltipG.transition().duration(0).attr('opacity', 1);

            tooltipRect
              .transition()
              .duration(0)
              .attr('x', d.x - overlay.offset + tooltip.offset)
              .attr('y', margin.top - tooltip.height / 2);

            tooltipY1
              .transition()
              .duration(0)
              .attr(
                'x',
                d.x - overlay.offset + tooltip.offset + tooltip.width / 2
              )
              .attr(
                'y',
                margin.top - tooltip.height / 2 + (tooltip.height / 4) * 1
              )
              .text(`${d.p_y1}${labels.tooltipY1}`);

            tooltipY2
              .transition()
              .duration(0)
              .attr(
                'x',
                d.x - overlay.offset + tooltip.offset + tooltip.width / 2
              )
              .attr(
                'y',
                margin.top - tooltip.height / 2 + (tooltip.height / 4) * 3
              )
              .text(`${d.p_y2}${labels.tooltipY2}`);
          })
          // MOUSE OUT => Overlay and tooltip desapparition
          .on('mouseout', function () {
            overlayRect.transition().duration(200).attr('opacity', 0);
            tooltipG.transition().duration(200).attr('opacity', 0);
          });
      }

      return () => {
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
