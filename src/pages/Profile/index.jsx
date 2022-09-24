import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';
import HeaderMain from '../../components/HeaderMain';
import KeyInfoCard from '../../components/KeyInfoCard';
import {
  USER_MAIN_DATA,
  USER_ACTIVITY,
  USER_AVERAGE_SESSIONS,
  USER_PERFORMANCE,
} from '../../data/data';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import RadarChart from '../../components/RadarChart';
import RadialBarChart from '../../components/RadialBarChart';

const StyledSection = styled.section`
  display: flex;
  flex-flow: row nowrap;
  column-gap: 3%;
`;

const ChartsContainer = styled.div`
  width: 74%;
  display: flex;
  flex-flow: row wrap;
  column-gap: 30px;
`;

const CardsContainer = styled.div`
  width: 23%;
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
          <BarChart
            title={'Activité quotidienne'}
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
          <LineChart
            title={{
              text: 'Durée moyenne\ndes sessions',
              margin: { top: 29, left: 34 },
            }}
            size={{ width: 258, height: 263, lineWidth: 2, lineHeight: 24 }}
            margin={{ top: 77, right: 0, bottom: 60, left: 0 }}
            labels={{
              x: '',
              y: '',
              tooltipY: ' min',
            }}
            data={[
              { x: 'D', y: 0 },
              { x: 'L', y: 30 },
              { x: 'M', y: 23 },
              { x: 'M', y: 45 },
              { x: 'J', y: 50 },
              { x: 'V', y: 0 },
              { x: 'S', y: 0 },
              { x: 'D', y: 60 },
              { x: 'L', y: 90 },
            ]}
          />
          <RadarChart
            title={{
              text: '',
              margin: {},
            }}
            size={{
              width: 258,
              height: 263,
              radius: 90,
              lineWidth: 1,
              lineHeight: 24,
            }}
            margin={{ top: 41, right: 39, bottom: 42, left: 39 }}
            levels={{ count: 5, max: 250 }}
            data={[
              { axis: 'Intensité', value: 90 },
              { axis: 'Vitesse', value: 200 },
              { axis: 'Force', value: 50 },
              { axis: 'Endurance', value: 140 },
              { axis: 'Énergie', value: 120 },
              { axis: 'Cardio', value: 80 },
            ]}
          />
          <RadialBarChart
            title={{
              text: 'Score',
              margin: { top: 24, left: 30 },
            }}
            size={{
              width: 258,
              height: 263,
              radius: 160 / 2 + 5,
              lineWidth: 10,
              lineHeight: 24,
            }}
            data={0.12}
          />
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
