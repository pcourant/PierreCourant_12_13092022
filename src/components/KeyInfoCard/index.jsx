import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';

const StyledCard = styled.article`
  width: 258px;
  height: 124px;
  background-color: ${colors.backgroundLight};
`;

const KeyInfoCard = ({ title, value, icon }) => {
  return <StyledCard></StyledCard>;
};

KeyInfoCard.propTypes = {};

export default KeyInfoCard;
