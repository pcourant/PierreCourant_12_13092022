import React, { useRef, useEffect } from 'react';
import { useUpdateWidth } from '../../utils/hooks';
import { KEYINFO_DIMENSION_RATIO, scale1spanChart } from '../../utils/charts';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import { select, xml } from 'd3';

/**
 * Render a key info card constructed with D3 library
 *
 * @component
 */
const KeyInfoCard = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const width = useUpdateWidth(chartContainerRef);

  useEffect(
    () => {
      if (chartContainerRef?.current && chartRef?.current) {
        //********************* CHART CONSTRUCTION ********************
        const height = width * KEYINFO_DIMENSION_RATIO;
        const svg = select(chartRef.current);
        svg.attr('height', height);

        //********************* DIMENSION PROCESSING *********************

        const icon = {
          url: props.icon,
          width: scale1spanChart(16, width),
          height: scale1spanChart(20, width),
          rectWidth: scale1spanChart(60, width),
          rectHeight: scale1spanChart(60, width),
          margin: {
            top: scale1spanChart(32, width),
            left: scale1spanChart(32, width),
          },
        };
        const data = {
          text: props.data,
          fontSize: scale1spanChart(20, width),
          lineHeight: scale1spanChart(24, width),
          margin: {
            top: scale1spanChart(44, width),
            left: scale1spanChart(116, width),
          },
        };
        const title = {
          text: props.title,
          fontSize: scale1spanChart(14, width),
          lineHeight: scale1spanChart(24, width),
          margin: {
            top: scale1spanChart(70, width),
            left: scale1spanChart(116, width),
          },
        };

        //********************* SVG CONSTRUCTION *********************
        const iconGroup = svg
          .append('g')
          .attr('class', 'iconGroup')
          .attr(
            'transform',
            `translate(${icon.margin.left},${icon.margin.top})`
          );

        iconGroup
          .append('rect')
          .attr('class', 'iconRect')
          .attr('rx', 6)
          .attr('width', icon.rectWidth)
          .attr('height', icon.rectHeight);

        if (icon.url)
          xml(icon.url).then((data) => {
            data.documentElement.setAttribute('width', icon.width);
            data.documentElement.setAttribute('height', icon.height);
            data.documentElement.classList.add('iconSVG');
            data.documentElement.setAttribute(
              'x',
              icon.rectWidth / 2 - icon.width / 2
            );
            data.documentElement.setAttribute(
              'y',
              icon.rectHeight / 2 - icon.height / 2
            );
            iconGroup.node().append(data.documentElement);
          });

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
          .attr('line-height', `${title.lineHeight}px`);

        // Data construction
        svg
          .append('text')
          .text(data.text)
          .attr('x', data.margin.left)
          .attr('y', data.margin.top)
          .attr('dominant-baseline', 'hanging')
          .attr('width', data.width)
          .attr('class', 'data')
          .attr('font-size', `${data.fontSize}px`)
          .attr('line-height', `${data.lineHeight}px`);
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
      <StyledKeyInfoCard width={'100%'} ref={chartRef} title={props.title} />
    </ChartContainer>
  );
};

KeyInfoCard.propTypes = {
  title: PropTypes.string,
  data: PropTypes.string,
  /**
   * URL of the icon
   */
  icon: PropTypes.instanceOf(URL),
};
KeyInfoCard.defaultProps = {
  title: 'Calories',
  data: '1999 Kcal',
  icon: null,
};

export default KeyInfoCard;

const ChartContainer = styled.div`
  width: 100%;
`;

const StyledKeyInfoCard = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: ${colors.backgroundLight};
  border-radius: 5px;
  position: relative;

  .iconRect {
    ${(props) => `fill: ${colors[props.title.toLowerCase()]};`}
    opacity: 0.07;
  }

  .iconSVG {
    ${(props) => `fill: ${colors[props.title.toLowerCase()]};`}
  }

  .title {
    font-weight: 500;
    fill: #74798c;
  }

  .data {
    font-weight: 700;
    fill: #282d30;
  }
`;
