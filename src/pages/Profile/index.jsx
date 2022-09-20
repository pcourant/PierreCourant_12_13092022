import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/colors';
import PropTypes from 'prop-types';
import HeaderMain from '../../components/HeaderMain';
import KeyInfoCard from '../../components/KeyInfoCard';
import {
  USER_MAIN_DATA,
  USER_ACTIVITY,
  USER_AVERAGE_SESSIONS,
  USER_PERFORMANCE,
} from '../../data/data';
import DoubleLinesChart from '../../components/DoubleLinesChart';
import LineChart from '../../components/LineChart';

const StyledSection = styled.section`
  display: flex;
  flex-flow: row nowrap;
  column-gap: 31px;
`;

const ChartsContainer = styled.div`
  width: 835px;
  height: 600px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  row-gap: 39px;
  justify-content: center;
  align-items: center;
`;

const yogaIcon = new URL('../../assets/yoga.svg', import.meta.url);
const swimIcon = new URL('../../assets/swim.svg', import.meta.url);
const bikeIcon = new URL('../../assets/bike.svg', import.meta.url);
const workoutIcon = new URL('../../assets/workout.svg', import.meta.url);

const Profile = (props) => {
  const { userId } = useParams();

  // console.log('userId: ', userId);
  // console.log('USER_MAIN_DATA: ', USER_MAIN_DATA);

  const userMainData = USER_MAIN_DATA.find((element) => element.id === +userId);
  const userActivity = USER_ACTIVITY.find(
    (element) => element.userId === +userId
  );
  const userAverageSessions = USER_AVERAGE_SESSIONS.find(
    (element) => element.userId === +userId
  );
  const userPerformance = USER_PERFORMANCE.find(
    (element) => element.userId === +userId
  );

  return (
    <>
      <HeaderMain
        title={`Bonjour ${
          userId ? userMainData?.userInfos?.firstName : 'Thomas'
        }`}
        subtitle={'Félicitation ! Vous avez explosé vos objectifs hier 👏'}
      />
      <StyledSection>
        <ChartsContainer>
          <DoubleLinesChart
            title={{
              text: 'Activité quotidienne',
              margins: { top: 24, left: 32 },
            }}
            sizes={{ width: 835, height: 320, lineWidth: 7, lineHeight: 24 }}
            margins={{ top: 112.5, right: 90, bottom: 62.5, left: 43 }}
            paddings={{ xAxisPadding: 11, linePadding: 8 }}
            labels={{
              x: '',
              y1: 'Poids (kg)',
              y2: 'Calories brûlées (kCal)',
              tooltipY1: 'kg',
              tooltipY2: 'Kcal',
            }}
            data={[
              { x: 1, y1: 70, y2: 240 },
              { x: 2, y1: 69, y2: 220 },
              { x: 3, y1: 70, y2: 280 },
              { x: 4, y1: 68.8, y2: 500 },
              { x: 5, y1: 69, y2: 160 },
              { x: 6, y1: 69, y2: 162 },
              { x: 7, y1: 69, y2: 390 },
              { x: 8, y1: 68.5, y2: 390 },
              { x: 9, y1: 68.2, y2: 390 },
              { x: 10, y1: 70.3, y2: 210 },
            ]}
          />
          {/* <LineChart /> */}
        </ChartsContainer>
        <CardsContainer>
          <KeyInfoCard
            value={'1,930kCal'}
            title={'Calories'}
            icon={{ color: '#FF0000', icon: yogaIcon }}
          />
          <KeyInfoCard />
          <KeyInfoCard />
          <KeyInfoCard />
        </CardsContainer>
      </StyledSection>
    </>
  );
};

Profile.propTypes = {};

export default Profile;
