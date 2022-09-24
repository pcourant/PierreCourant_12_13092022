import React, { useRef, useEffect } from 'react';
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

const StyledSvg = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: #282d30;
  border-radius: 5px;

  .label {
    fill: white;
    font-size: 12px;
    font-weight: 500;
  }

  .path {
    fill: #ff0101;
    opacity: 0.2;
  }
`;

const RadarChart = (props) => {
  const { width, height, radius, lineWidth, lineHeight } = props.size;
  const margin = props.margin;
  const data = props.data;
  const d3Container = useRef(null);

  useEffect(
    () => {
      if (data && d3Container.current) {
        const svg = select(d3Container.current);

        //********************* DATA PROCESSING *********************
        const levels = [];
        for (let i = 0; i < props.levels.count; i++) {
          levels.push((props.levels.max / 5) * (i + 1));
        }

        const axis = (d, i) => i;
        const value = (d) => d.value;

        const xScale = scaleLinear();

        // console.log('extent(data, axis)', extent(data, axis));

        const axisScale = scaleLinear()
          .domain([0, levels[levels.length - 1]])
          .range([0, radius]);

        const marks = data.map((d, index) => ({
          x: axis(d, index),
          y: axisScale(value(d)),
          axis: d.axis,
          value: value(d),
          // cX:,
          // cY:,
        }));

        console.log('marks', marks);

        //********************* DATA VISUALIZATION *********************

        function getCoordinates(radius, axis) {
          var angle_deg = 60 * axis - 30;
          var angle_rad = (Math.PI / 180) * angle_deg;
          return [
            Math.round(radius + radius * Math.cos(angle_rad)),
            Math.round(radius + radius * Math.sin(angle_rad)),
          ];
        }

        function hexagonCoordinates(radius) {
          const points = [5, 0, 1, 2, 3, 4].map((i) => {
            return getCoordinates(radius, i);
          });

          return points;
        }

        function hexagonPoints(hexCoordinates) {
          return hexCoordinates.map((p) => p.join(',')).join(' ');
        }

        const levelsHexCoord = [];
        levels.forEach((level) =>
          levelsHexCoord.push(hexagonCoordinates(axisScale(level)))
        );

        console.log('levelsHexCoord', levelsHexCoord);

        levels.forEach((level, i) => {
          svg
            .append('polygon')
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr('points', hexagonPoints(levelsHexCoord[i]))
            .attr(
              'transform',
              `translate(${width / 2 - axisScale(level)},${
                height / 2 - axisScale(level)
              })`
            );
        });

        // Labels construction
        const labelsOffset = [
          { dx: 0, dy: -10, dominantBaseline: 'Auto', textAnchor: 'middle' },
          { dx: 5, dy: 0, dominantBaseline: 'middle', textAnchor: 'start' },
          { dx: 5, dy: 0, dominantBaseline: 'hanging', textAnchor: 'start' },
          { dx: 0, dy: 10, dominantBaseline: 'hanging', textAnchor: 'middle' },
          { dx: -5, dy: 0, dominantBaseline: 'hanging', textAnchor: 'end' },
          { dx: -5, dy: 0, dominantBaseline: 'middle', textAnchor: 'end' },
        ];

        marks.forEach((d) => {
          // console.log('d', d);
          // console.log('x', levelsHexCoord[levels.length - 1][d.x][0]);
          // console.log('y', levelsHexCoord[levels.length - 1][d.x][1]);
          // const tooltip = svg.append('g');
          svg
            .append('text')
            .attr('class', 'label')
            .attr(
              'x',
              levelsHexCoord[levels.length - 1][d.x][0] + labelsOffset[d.x].dx
            )
            .attr(
              'y',
              levelsHexCoord[levels.length - 1][d.x][1] + labelsOffset[d.x].dy
            )
            .attr(
              'transform',
              `translate(${width / 2 - axisScale(levels[levels.length - 1])},${
                height / 2 - axisScale(levels[levels.length - 1])
              })`
            )
            .attr('dominant-baseline', labelsOffset[d.x].dominantBaseline)
            .attr('text-anchor', labelsOffset[d.x].textAnchor)
            .text(d.axis);

          // Get radar coordinates of the data
          // function angleToCoordinate(angle, value) {
          //   let x = Math.cos(angle) * axisScale(value);
          //   let y = Math.sin(angle) * axisScale(value);
          //   return { x: 180 + x, y: 180 - y };
          // }

          // for (var i = 0; i < 6; i++) {
          //   const angle = Math.PI / 2 + (2 * Math.PI * i) / 6;
          //   let label_coordinate = angleToCoordinate(angle, 10.5);
          //   //draw axis label
          //   svg
          //     .append('text')
          //     .attr('x', label_coordinate.x)
          //     .attr('y', label_coordinate.y)
          //     .text('X');
          // }

          // Draw the axis
          function angleToCoordinate(angle, value) {
            let x = Math.cos(angle) * axisScale(value);
            let y = Math.sin(angle) * axisScale(value);
            return { x: 90 + x, y: 90 - y };
          }

          const axisGroup = svg
            .append('g')
            .attr(
              'transform',
              `translate(${width / 2 - axisScale(levels[levels.length - 1])},${
                height / 2 - axisScale(levels[levels.length - 1])
              })`
            );

          for (let i = 0; i < marks.length; i++) {
            let ft_name = marks[i].axis;
            let angle = Math.PI / 2 + (2 * Math.PI * i) / marks.length;
            let line_coordinate = angleToCoordinate(angle, 250);
            let label_coordinate = angleToCoordinate(angle, 250);

            //draw axis line
            axisGroup
              .append('line')
              .attr('x1', 90)
              .attr('y1', 90)
              .attr('x2', line_coordinate.x)
              .attr('y2', line_coordinate.y)
              .attr('stroke', 'red')
              .attr('opacity', 0);
          }

          for (let i = 0; i < marks.length; i++) {
            let angle = Math.PI / 2 + (2 * Math.PI * -i) / marks.length;
            let line_coordinate = angleToCoordinate(angle, marks[i].value);

            //draw axis line
            axisGroup
              .append('circle')
              .attr('r', 10)
              .attr('cx', line_coordinate.x)
              .attr('cy', line_coordinate.y)
              .attr('fill', 'transparent')
              .append('title')
              .text((d) => `( ${marks[i].axis}, ${marks[i].value} )`);
          }

          function getPathCoordinates() {
            let coordinates = [];
            for (var i = 0; i < marks.length; i++) {
              let angle = Math.PI / 2 + (2 * Math.PI * -i) / marks.length;
              coordinates.push(angleToCoordinate(angle, marks[i].value));
            }
            return coordinates;
          }

          const lineG = line()
            .x((d) => d.x)
            .y((d) => d.y);

          //draw the path element
          axisGroup
            .append('path')
            .attr('class', 'path')
            .datum(getPathCoordinates())
            .attr('d', lineG);
          // .attr('stroke-width', 0)
          // .attr('stroke', 'pink')
          // .attr('fill', '#FF0101');
          // .attr('opacity', 0.7);
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

RadarChart.propTypes = {};

export default RadarChart;
