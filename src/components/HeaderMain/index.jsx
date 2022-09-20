import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/colors';

const StyledTitle = styled.h1`
  font-size: 48px;
  font-weight: 500;
`;

const StyledSubtitle = styled.p``;

const HeaderMain = ({ title, subtitle }) => {
  return (
    <header>
      <StyledTitle>{title}</StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
    </header>
  );
};

HeaderMain.propTypes = {};

export default HeaderMain;
