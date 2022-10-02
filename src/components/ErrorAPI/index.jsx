import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';

/**
 * Render the error status and message from an API call
 *
 * @component
 */
const ErrorAPI = ({ status, message }) => {
  return (
    <MainWrapper>
      <StyledTitle>{status}</StyledTitle>
      <StyledText>{message}</StyledText>
    </MainWrapper>
  );
};

ErrorAPI.propTypes = {
  /**
   * Error status
   */
  status: PropTypes.string,
  /**
   * Error message
   */
  message: PropTypes.string,
};
ErrorAPI.defaultProps = {
  status: 'error status',
  message: 'error message',
};

export default ErrorAPI;

const MainWrapper = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
`;

const StyledTitle = styled.h1`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 36px;
  font-weight: 700;
  color: ${colors.secondary};
`;

const StyledText = styled.p`
  color: ${colors.secondary};
  margin-bottom: 20px;
`;
