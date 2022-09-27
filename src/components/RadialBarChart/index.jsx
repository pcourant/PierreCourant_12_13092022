import React, { useRef, useEffect } from 'react';
import { useUpdateWidth } from '../../utils/hooks';
import {
  SQUARE_DIMENSION_RATIO,
  scale1spanChart,
  wrap,
  describeArc,
} from '../../utils/charts';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';
import { select } from 'd3';

const ChartContainer = styled.div`
  width: 100%;
`;

const StyledRadarChart = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: #fbfbfb;
  border-radius: 5px;

  .title {
    font-weight: 500;
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

  #arcPath {
    fill: transparent;
    stroke-linecap: round;
    stroke: red;
  }

  #legend {
    fill: #74798c;
  }
  #data-legend {
    font-weight: 700;
    fill: #282d30;
  }
`;

const RadialBarChart = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const width = useUpdateWidth(chartContainerRef);

  useEffect(
    () => {
      if (chartContainerRef?.current && chartRef?.current) {
        const height = width * SQUARE_DIMENSION_RATIO;
        const svg = select(chartRef.current);
        svg.attr('height', height);

        //********************* DIMENSION PROCESSING *********************

        const lineWidth = scale1spanChart(10, width);
        const title = {
          text: props.title,
          fontSize: scale1spanChart(15, width),
          lineHeight: scale1spanChart(24, width),
          margin: {
            top: scale1spanChart(24, width),
            left: scale1spanChart(30, width),
          },
        };
        const radius = scale1spanChart(160 / 2, width) + lineWidth / 2;
        const data = props.data;
        const legend = {
          text: props.legend,
          fontSize: scale1spanChart(16, width),
          lineHeight: scale1spanChart(26, width),
          width: scale1spanChart(95, width),
          dataFontSize: scale1spanChart(26, width),
        };

        //********************* DATA PROCESSING *********************

        const mark = {
          angle: 360 * data,
          value: data,
        };

        //********************* DATA VISUALIZATION ********************

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
          .call(wrap, title.lineHeight);

        const chart = svg
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        chart
          .append('circle')
          .attr('id', 'innerCircle')
          .attr('r', radius - lineWidth / 2);

        //********************* PLOTTING DATA *********************

        const arcPath = describeArc(0, 0, radius, 360 - mark.angle, 360);

        // Visualization arc
        chart
          .selectAll('path #arcPath')
          .data([mark])
          .join('path')
          .attr('id', 'arcPath')
          .attr('d', arcPath)
          .attr('stroke-width', lineWidth);

        // Chart legend
        const legendGroup = chart.append('g');

        legendGroup
          .append('text')
          .text(`${data * 100}%`)
          .attr('x', 0)
          .attr('y', -legend.lineHeight / 2)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('id', 'data-legend')
          .attr('font-size', `${legend.dataFontSize}px`)
          .attr('line-height', `${legend.lineHeight}px`);
        legendGroup
          .append('text')
          .text(`${legend.text}`)
          .attr('x', 0)
          .attr('y', legend.lineHeight / 2)
          .attr('dominant-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('width', legend.width)
          .attr('id', 'legend')
          .attr('font-size', `${legend.fontSize}px`)
          .attr('line-height', `${legend.lineHeight}px`)
          .call(wrap, legend.lineHeight);
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

RadialBarChart.propTypes = {};

export default RadialBarChart;
