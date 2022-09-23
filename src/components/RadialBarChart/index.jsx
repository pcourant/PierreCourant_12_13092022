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
  background-color: #fbfbfb;
  border-radius: 5px;

  .title {
    font-size: 15px;
    font-weight: 500;
    line-height: 24px;
    fill: #20253a;
  }

  .data {
    fill: #282d30;
    font-size: 26px;
    font-weight: 700;
    line-height: 26px;
  }
  .text {
    fill: #74798c;
    font-size: 26px;
    font-weight: 700;
    line-height: 26px;
  }

  #innerCircle {
    fill: white;
  }

  #arc {
    fill: transparent;
  }
`;

function wrap(text, lineHeight) {
  text.each(function () {
    var text = select(this);
    var words = text.text().split(/\s+/).reverse();
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
}

const RadialBarChart = (props) => {
  const title = props.title;
  const { width, height, radius, lineWidth, lineHeight } = props.size;
  const margin = props.margin;
  const data = props.data;

  const d3Container = useRef(null);

  useEffect(
    () => {
      if (data && d3Container.current) {
        const svg = select(d3Container.current);

        //********************* DATA PROCESSING *********************
        const scale = scaleLinear()
          .domain([0, 1])
          .range([0, 2 * Math.PI * 1]);

        const mark = {
          angle: 360 * data,
          value: data,
        };

        console.log('scale', scale);
        console.log('mark', mark);

        //********************* DATA VISUALIZATION ********************

        // Title
        const yTitle = lineHeight / 2 + title.margin.top;
        svg
          .append('text')
          .text(title.text)
          .attr('x', title.margin.left)
          .attr('y', yTitle)
          .attr('class', 'title');

        svg
          .append('circle')
          .attr('id', 'innerCircle')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', radius - lineWidth / 2);

        function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
          var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

          return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
          };
        }

        function describeArc(cx, cy, radius, startAngle, endAngle) {
          var start = polarToCartesian(cx, cy, radius, endAngle);
          var end = polarToCartesian(cx, cy, radius, startAngle);

          console.log('start', start);
          console.log('end', end);

          var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

          var d = [
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

        const pathD = describeArc(
          width / 2,
          height / 2,
          radius,
          360 - mark.angle,
          360
        );
        console.log('pathD', pathD);

        // Plotting marks
        svg
          .selectAll('path .mark')
          .data([mark])
          .join('path')
          .attr('id', 'arc')
          .attr('d', pathD)
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', lineWidth)
          .attr('stroke', 'red');
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

RadialBarChart.propTypes = {};

export default RadialBarChart;
