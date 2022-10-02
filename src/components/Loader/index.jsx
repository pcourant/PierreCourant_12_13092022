import React from 'react';
import styled, { keyframes } from 'styled-components';
import colors from '../../utils/styles/colors';

/**
 * Render the animated loader
 */
const Loader = () => {
  return <StyledLoader></StyledLoader>;
};

export default Loader;

const rotate = keyframes`
 from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledLoader = styled.div`
  text-align: center;
  margin: 50px auto;
  padding: 30px;
  border: 10px solid ${colors.secondary};
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: ${rotate} 1s infinite linear;
  height: 0;
  width: 0;
`;
