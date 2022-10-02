import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';

/**
 * Render the error from an API call
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
  status: PropTypes.string,
  message: PropTypes.string,
};
ErrorAPI.defaultProps = {
  status: '',
  message: '',
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
