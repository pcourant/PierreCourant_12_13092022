import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
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
    fill: #ffffff;
  }
`;

const LineChart = (props) => {
  const title = props.title;
  const { width, height, lineWidth, lineHeight } = props.sizes;
  const margins = props.margins;
  const yTitleAndCaption = lineHeight / 2 + title.margins.top;
  const xAxisPadding = props.paddings.xAxisPadding;
  const data = props.data;

  const d3Container = useRef(null);

  useEffect(
    () => {
      if (data && d3Container.current) {
        const svg = select(d3Container.current);

        //********************* DATA PROCESSING *********************
        const xValue = (d) => d.x;
        const yValue = (d) => d.y;

        const xExtent = extent(data, xValue);
        const yExtent = extent(data, yValue);

        const xScale = scaleLinear()
          .domain(extent(data, xValue))
          .range([
            margins.left + xAxisPadding,
            width - margins.right - xAxisPadding,
          ]);
        const yScale = scaleLinear()
          .domain([0, yExtent[1]])
          .range([height - margins.bottom, margins.top]);

        const marks = data.map((d) => ({
          x: xScale(xValue(d)),
          y: yScale(yValue(d)),
          p_x: xValue(d),
          p_y: yValue(d),
        }));

        console.log('marks', marks);

        //********************* DATA VISUALIZATION *********************

        // Title construction
        svg
          .append('text')
          .text(title.text)
          .attr('x', title.margins.left)
          .attr('y', yTitleAndCaption)
          .attr('class', 'title');

        // X axis construction
        const xAxisGenerator = axisBottom(xScale).tickPadding(20);

        const xAxis = svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height - margins.bottom})`)
          .call(xAxisGenerator);

        xAxis.selectAll('.domain').remove();
        xAxis.selectAll('.tick line').remove();
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
