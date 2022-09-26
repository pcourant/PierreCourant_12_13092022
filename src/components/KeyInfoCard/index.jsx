import React, { useRef, useEffect } from 'react';
import { useUpdateWidth } from '../../utils/hooks';
import { KEYINFO_DIMENSION_RATIO, scale1spanChart } from '../../utils/charts';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
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

const StyledKeyInfoCard = styled.svg.attrs({
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
})`
  background-color: ${colors.backgroundLight};
  border-radius: 5px;
`;

const KeyInfoCard = (props) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const width = useUpdateWidth(chartContainerRef);

  useEffect(
    () => {
      if (chartRef.current) {
        const height = width * KEYINFO_DIMENSION_RATIO;
        const svg = select(chartRef.current);
        svg.attr('height', height);

        //********************* DIMENSION PROCESSING *********************
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
      <StyledKeyInfoCard width={'100%'} ref={chartRef} />
    </ChartContainer>
  );
};

KeyInfoCard.propTypes = {};

export default KeyInfoCard;
