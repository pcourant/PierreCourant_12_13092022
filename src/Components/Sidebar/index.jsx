import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/colors';

const SidebarWrapper = styled.div`
  width: 117px;
  /* height: 100vh; */
  height: 1024px;
  background-color: ${colors.backgroundDark};
  position: absolute;
  top: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const StyledNav = styled.nav`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
  margin-bottom: 14px;
`;

const StyledNavLink = styled(NavLink)`
  width: 64px;
  height: 64px;
  color: ${colors.secondary};
  background-color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const CopyrightWrapper = styled.p`
  position: absolute;
  /* bottom: 5.76vh; */
  bottom: 59px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  writing-mode: vertical-rl;
  transform: rotate(-180deg);
`;

const yogaIcon = new URL('../../assets/yoga.svg', import.meta.url);
const swimIcon = new URL('../../assets/swim.svg', import.meta.url);
const bikeIcon = new URL('../../assets/bike.svg', import.meta.url);
const workoutIcon = new URL('../../assets/workout.svg', import.meta.url);

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <StyledNav>
        <StyledNavLink>
          <img src={yogaIcon} alt="yoga icon" />
        </StyledNavLink>
        <StyledNavLink>
          <img src={swimIcon} alt="swim icon" />
        </StyledNavLink>
        <StyledNavLink>
          <img src={bikeIcon} alt="bike icon" />
        </StyledNavLink>
        <StyledNavLink>
          <img src={workoutIcon} alt="workout icon" />
        </StyledNavLink>
      </StyledNav>
      <CopyrightWrapper>Copiryght, SportSee 2020</CopyrightWrapper>
    </SidebarWrapper>
  );
};

export default Sidebar;
