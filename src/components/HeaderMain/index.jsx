import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';

/**
 * Render the header of the main section
 */
const HeaderMain = ({ title, highlightTitle, subtitle }) => {
  return (
    <header>
      <StyledTitle>
        {title}
        <StyledHighlightTitle>{highlightTitle}</StyledHighlightTitle>
      </StyledTitle>
      <StyledSubtitle>{subtitle}</StyledSubtitle>
    </header>
  );
};

HeaderMain.propTypes = {
  title: PropTypes.string,
  highlightTitle: PropTypes.string,
  subtitle: PropTypes.string,
};
HeaderMain.defaultProps = {
  title: '',
  highlightTitle: '',
  subtitle: '',
};

export default HeaderMain;

const StyledTitle = styled.h1`
  font-size: 3.333vw;
  font-weight: 500;
`;

const StyledHighlightTitle = styled.span`
  color: ${colors.secondary};
`;

const StyledSubtitle = styled.p``;
