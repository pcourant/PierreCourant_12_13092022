import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';

const logo = new URL('../../assets/logo.svg', import.meta.url);

/**
 * Render the header, visible on all pages
 */
const Header = () => {
  return (
    <StyledHeader>
      <LogoWrapper>
        <img src={logo} alt="logo" />
      </LogoWrapper>
      <StyledNav>
        <StyledNavLink to="/home">Accueil</StyledNavLink>
        <StyledNavLink to="/profile">Profil</StyledNavLink>
        <StyledNavLink to="/setting">Réglage</StyledNavLink>
        <StyledNavLink to="/community">Communauté</StyledNavLink>
      </StyledNav>
    </StyledHeader>
  );
};

export default Header;

const StyledHeader = styled.header`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 91px;
  background-color: ${colors.backgroundDark};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const LogoWrapper = styled.div`
  height: 61px;
  margin-left: 29px;
`;

const StyledNav = styled.nav`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-left: 10vw;
  margin-right: 6vw;
`;

const StyledNavLink = styled(NavLink)`
  padding: 10px 15px;
  color: white;
  text-decoration: none;
  font-size: 24px;

  &.active {
    color: ${colors.secondary};
    text-underline-position: under;
    border-radius: 30px;
  }
`;
