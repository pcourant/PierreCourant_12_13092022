import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/colors';

const logo = new URL('../../assets/logo.svg', import.meta.url);

const StyledNavLink = styled(NavLink)`
  padding: 15px;
  color: ${colors.primary};
  text-decoration: none;
  font-size: 18px;

  &.active {
    color: ${colors.secondary};
    border-radius: 30px;
    background-color: ${colors.primary};
  }
`;

const Header = (props) => {
  return (
    <header>
      <img src={logo} alt="logo" />
      <nav>
        <StyledNavLink to="/home">Accueil</StyledNavLink>
        <StyledNavLink to="/profile">Profil</StyledNavLink>
        <StyledNavLink to="/setting">Réglage</StyledNavLink>
        <StyledNavLink to="/community">Communauté</StyledNavLink>
      </nav>
    </header>
  );
};

Header.propTypes = {};

export default Header;
