import React, { useRef, useEffect } from 'react';
import { useUpdateWidth } from '../../utils/hooks';
import { SQUARE_DIMENSION_RATIO, scaleSquaredChart } from '../../utils/charts';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';
import {
  select,
  scaleLinear,
  extent,
  axisBottom,
  axisRight,
  format,
  line,
} from 'd3';

const ChartContainer = styled.div`
  width: 100%;
`;

const StyledRadarChart = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: #282d30;
  border-radius: 5px;

  .label {
    fill: white;
    font-weight: 500;
  }

  .path {
    fill: #ff0101;
    opacity: 0.2;
  }
`;

const RadarChart = (props) => {
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

        const features = props.features;
        const levels = props.levels;
        const data = props.data;

        const lineHeight = 24;
        const lineWidth = 1;
        const radius = Math.round(scaleSquaredChart(90, width));
        const HEXAGONAL_POINTS = 6;

        const featuresFontSize = scaleSquaredChart(12, width);
        const featuresOffset = [
          {
            dx: 0,
            dy: scaleSquaredChart(-10, width),
            dominantBaseline: 'Auto',
            textAnchor: 'middle',
          },
          {
            dx: scaleSquaredChart(5, width),
            dy: 0,
            dominantBaseline: 'middle',
            textAnchor: 'start',
          },
          {
            dx: scaleSquaredChart(5, width),
            dy: 0,
            dominantBaseline: 'hanging',
            textAnchor: 'start',
          },
          { dx: 0, dy: 10, dominantBaseline: 'hanging', textAnchor: 'middle' },
          {
            dx: scaleSquaredChart(-5, width),
            dy: 0,
            dominantBaseline: 'hanging',
            textAnchor: 'end',
          },
          {
            dx: scaleSquaredChart(-5, width),
            dy: 0,
            dominantBaseline: 'middle',
            textAnchor: 'end',
          },
        ];

        //********************* DATA PROCESSING *********************

        function getCoordinates(value, radius, index) {
          const angle = Math.PI / 2 + (2 * Math.PI * -index) / HEXAGONAL_POINTS;
          const x = Math.cos(angle) * value;
          const y = Math.sin(angle) * value;
          return { x: radius + x, y: radius - y };
        }

        const yScale = scaleLinear().domain([0, levels.max]).range([0, radius]);

        const marks = data.map((d, i) => {
          const coordinates = getCoordinates(yScale(d), radius, i);
          return {
            x: coordinates.x,
            y: coordinates.y,
            value: d,
            feature: features[i],
          };
        });

        //********************* CHART CONSTRUCTION *********************

        // Hexagons construction
        function getHexagonPoints(hexagonRadius, containerRadius) {
          const hexagonPoints = [];
          for (let i = 0; i < HEXAGONAL_POINTS; i++) {
            const coordinates = getCoordinates(
              hexagonRadius,
              containerRadius,
              i
            );
            hexagonPoints.push([coordinates.x, coordinates.y]);
          }

          return hexagonPoints;
        }

        function pointsToPath(points) {
          return points.map((p) => p.join(',')).join(' ');
        }

        const chart = svg
          .append('g')
          .attr(
            'transform',
            `translate(${width / 2 - radius},${height / 2 - radius})`
          );

        const hexagons = chart.append('g');

        for (let i = 1; i <= levels.count; i++) {
          const level = (levels.max / 5) * i;
          hexagons
            .append('polygon')
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr(
              'points',
              pointsToPath(getHexagonPoints(yScale(level), radius))
            );
        }

        //  Features labels construction
        const featureLabels = chart.append('g');
        const outerHexagonCoordinates = getHexagonPoints(
          yScale(levels.max),
          radius
        );

        features.forEach((feature, index) => {
          featureLabels
            .append('text')
            .attr('class', 'label')
            .attr(
              'x',
              outerHexagonCoordinates[index][0] + featuresOffset[index].dx
            )
            .attr(
              'y',
              outerHexagonCoordinates[index][1] + featuresOffset[index].dy
            )
            .attr('font-size', `${featuresFontSize}px`)
            .attr('dominant-baseline', featuresOffset[index].dominantBaseline)
            .attr('text-anchor', featuresOffset[index].textAnchor)
            .text(feature);
        });

        //********************* PLOTTING DATA *********************

        const dataPolygon = chart.append('g');
        const markPoints = marks.map((mark) => [mark.x, mark.y]);

        //Draw the data polygon
        dataPolygon
          .datum(markPoints)
          .append('polygon')
          .attr('class', 'data-polygon')
          .attr('points', pointsToPath(markPoints))
          .attr('stroke-width', 0)
          .attr('stroke', 'pink')
          .attr('fill', '#FF0101')
          .attr('opacity', 0.7);

        //Draw title elements
        dataPolygon
          .selectAll('circle .data-title')
          .data(marks)
          .join('circle')
          .attr('class', 'data-title')
          .attr('r', 10)
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y)
          .attr('fill', 'transparent')
          .append('title')
          .text((d) => `${d.feature}: ${d.value}`);
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
      <StyledRadarChart width={'100%'} ref={chartRef} />
    </ChartContainer>
  );
};

RadarChart.propTypes = {};

export default RadarChart;
