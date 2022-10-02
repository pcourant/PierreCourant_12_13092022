import React, { useRef, useEffect } from 'react';
import { useUpdateWidth } from '../../utils/hooks';
import {
  SQUARE_DIMENSION_RATIO,
  scale1spanChart,
  getCoordinates,
  getHexagonPoints,
  pointsToPath,
} from '../../utils/charts';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { select, scaleLinear } from 'd3';

/**
 * Render a hexagonal radar chart constructed with D3 library
 */
const RadarChart = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const width = useUpdateWidth(chartContainerRef);

  useEffect(
    () => {
      if (chartContainerRef?.current && chartRef?.current && props.data) {
        //********************* CHART CONSTRUCTION ********************

        const height = width * SQUARE_DIMENSION_RATIO;
        const svg = select(chartRef.current);
        svg.attr('height', height);

        //********************* DIMENSION PROCESSING *********************

        const levels = props.levels;
        const data = props.data;
        const radius = Math.round(scale1spanChart(90, width));
        const features = {
          length: props.features.length,
          labels: props.features,
          fontSize: scale1spanChart(12, width),
          offset: [
            {
              dx: 0,
              dy: scale1spanChart(-10, width),
              dominantBaseline: 'Auto',
              textAnchor: 'middle',
            },
            {
              dx: scale1spanChart(5, width),
              dy: 0,
              dominantBaseline: 'middle',
              textAnchor: 'start',
            },
            {
              dx: scale1spanChart(5, width),
              dy: 0,
              dominantBaseline: 'hanging',
              textAnchor: 'start',
            },
            {
              dx: 0,
              dy: 10,
              dominantBaseline: 'hanging',
              textAnchor: 'middle',
            },
            {
              dx: scale1spanChart(-5, width),
              dy: 0,
              dominantBaseline: 'hanging',
              textAnchor: 'end',
            },
            {
              dx: scale1spanChart(-5, width),
              dy: 0,
              dominantBaseline: 'middle',
              textAnchor: 'end',
            },
          ],
        };

        //********************* DATA PROCESSING *********************

        const yScale = scaleLinear().domain([0, levels.max]).range([0, radius]);

        const marks = data.map((d, i) => {
          const coordinates = getCoordinates(yScale(d), radius, i);
          return {
            x: coordinates.x,
            y: coordinates.y,
            value: d,
            feature: features.labels[i],
          };
        });

        //********************* CHART CONSTRUCTION *********************
        const chart = svg
          .append('g')
          .attr(
            'transform',
            `translate(${width / 2 - radius},${height / 2 - radius})`
          );

        // Hexagons construction
        const hexagons = chart.append('g');

        for (let l = 1; l <= levels.count; l++) {
          const level = (levels.max / 5) * l;
          hexagons
            .append('polygon')
            .attr('class', 'hexagon')
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
        features.labels.forEach((label, index) => {
          featureLabels
            .append('text')
            .attr('class', 'label')
            .attr(
              'x',
              outerHexagonCoordinates[index][0] + features.offset[index].dx
            )
            .attr(
              'y',
              outerHexagonCoordinates[index][1] + features.offset[index].dy
            )
            .attr('font-size', `${features.fontSize}px`)
            .attr('dominant-baseline', features.offset[index].dominantBaseline)
            .attr('text-anchor', features.offset[index].textAnchor)
            .text(label);
        });

        //********************* PLOTTING DATA *********************

        const dataPolygon = chart.append('g');
        const markPoints = marks.map((mark) => [mark.x, mark.y]);

        //Draw the data polygon
        dataPolygon
          .datum(markPoints)
          .append('polygon')
          .attr('class', 'data-polygon')
          .attr('points', pointsToPath(markPoints));

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
        while (chartRef?.current?.firstChild) {
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

RadarChart.propTypes = {
  levels: PropTypes.exact({
    count: PropTypes.number,
    max: PropTypes.number,
  }),
  features: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    location,
    propFullName
  ) {
    if (propValue.length !== 6) {
      return new Error(
        `\nInvalid prop ${propFullName} supplied to ${componentName}.\n` +
          `Validation failed.\n` +
          `It needs to be an array of length 6 (currently ${propValue.length})\n`
      );
    } else if (typeof propValue[key] !== 'string') {
      return new Error(
        `\nInvalid prop ${propFullName} supplied to ${componentName}.\n` +
          `Validation failed.\n` +
          `${propValue[key]} needs to be a string (currently ${typeof propValue[
            key
          ]})\n`
      );
    }
  }),
  data: PropTypes.arrayOf(function (
    propValue,
    key,
    componentName,
    location,
    propFullName
  ) {
    if (propValue.length !== 6) {
      return new Error(
        `\nInvalid prop ${propFullName} supplied to ${componentName}.\n` +
          `Validation failed.\n` +
          `It needs to be an array of length 6 (currently ${propValue.length})\n`
      );
    } else if (typeof propValue[key] !== 'number') {
      return new Error(
        `\nInvalid prop ${propFullName} supplied to ${componentName}.\n` +
          `Validation failed.\n` +
          `${propValue[key]} needs to be a number (currently ${typeof propValue[
            key
          ]})\n`
      );
    }
  }),
};
RadarChart.defaultProps = {
  levels: {
    count: 5,
    max: 250,
  },
  features: [
    'feature1',
    'feature2',
    'feature3',
    'feature4',
    'feature5',
    'feature6',
  ],
  data: [125, 125, 125, 125, 125, 125],
};

export default RadarChart;

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

  .hexagon {
    fill: transparent;
    stroke: white;
  }

  .label {
    fill: white;
    font-weight: 500;
  }

  .data-polygon {
    stroke-width: 0;
    fill: #ff0101;
    opacity: 0.7;
  }
`;
