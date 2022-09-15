import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/colors';

const StyledHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 91px;
  background-color: ${colors.backgroundDark};
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
    /* color: ${colors.secondary}; */
    color: ${colors.backgroundDark};
    /* text-decoration-line: underline; */
    /* text-underline-position: under; */
    border-radius: 30px;
    background-color: ${colors.secondary};
  }
`;

const logo = new URL('../../assets/logo.svg', import.meta.url);

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
