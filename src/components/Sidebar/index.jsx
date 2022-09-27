import React from 'react';
import { useWindowSize } from '../../utils/hooks';
import { NavLink } from 'react-router-dom';
import {
  SIDEBAR_DIMENSION_RATIO,
  prorataWindowScale,
} from '../../utils/charts';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';

const SidebarWrapper = styled.div`
  width: 8.125vw;
  /* width: ${(props) => prorataWindowScale(117, props.windowwidth)}; */
  height: ${(props) => prorataWindowScale(1024, props.windowwidth)};
  /* width: 117px; */
  /* height: 100vh; */
  /* height: 1024px; */
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
  row-gap: ${(props) => prorataWindowScale(20, props.windowwidth)}px;
  /* row-gap: 20px; */
  margin-bottom: ${(props) => prorataWindowScale(14, props.windowwidth)};
  /* margin-bottom: 14px; */
`;

const StyledNavLink = styled(NavLink)`
  width: ${(props) => prorataWindowScale(64, props.windowwidth)};
  /* width: 64px; */
  height: ${(props) => prorataWindowScale(64, props.windowwidth)};
  /* height: 64px; */
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
  bottom: ${(props) => prorataWindowScale(59, props.windowwidth)};
  /* bottom: 59px; */
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
  const [windowwidth] = useWindowSize();

  return (
    <SidebarWrapper windowwidth={windowwidth}>
      <StyledNav windowwidth={windowwidth}>
        <StyledNavLink windowwidth={windowwidth}>
          <img
            src={yogaIcon}
            alt="yoga icon"
            width={prorataWindowScale(36, windowwidth)}
            height={prorataWindowScale(32, windowwidth)}
          />
        </StyledNavLink>
        <StyledNavLink windowwidth={windowwidth}>
          <img
            src={swimIcon}
            alt="swim icon"
            width={prorataWindowScale(32, windowwidth)}
            height={prorataWindowScale(32, windowwidth)}
          />
        </StyledNavLink>
        <StyledNavLink windowwidth={windowwidth}>
          <img
            src={bikeIcon}
            alt="bike icon"
            width={prorataWindowScale(38, windowwidth)}
            height={prorataWindowScale(32, windowwidth)}
          />
        </StyledNavLink>
        <StyledNavLink windowwidth={windowwidth}>
          <img
            src={workoutIcon}
            alt="workout icon"
            width={prorataWindowScale(32, windowwidth)}
            height={prorataWindowScale(32, windowwidth)}
          />
        </StyledNavLink>
      </StyledNav>
      <CopyrightWrapper windowwidth={windowwidth}>
        Copiryght, SportSee 2020
      </CopyrightWrapper>
    </SidebarWrapper>
  );
};

export default Sidebar;
