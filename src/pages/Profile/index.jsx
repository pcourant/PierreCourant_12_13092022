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
  justify-content: space-between;
`;

const ChartsContainer = styled.div`
  width: 74%;
  display: flex;
  flex-flow: row wrap;
  gap: 2.08vw;
`;

const SquaredChart = styled.div`
  width: 31%;
`;

const CardsContainer = styled.div`
  width: 23%;
  display: flex;
  flex-flow: column nowrap;
  row-gap: 2.71vw;
  justify-content: start;
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
          <SquaredChart>
            <LineChart
              title={'Durée moyenne des sessions'}
              labels={{
                x: '',
                y: '',
                tooltipY: ' min',
              }}
              data={[0, 30, 23, 45, 50, 0, 0, 60, 90]}
            />
          </SquaredChart>
          <SquaredChart>
            <RadarChart
              margin={{ top: 41, right: 39, bottom: 42, left: 39 }}
              levels={{ count: 5, max: 250 }}
              features={[
                'Intensité',
                'Vitesse',
                'Force',
                'Endurance',
                'Énergie',
                'Cardio',
              ]}
              data={[100, 200, 50, 150, 250, 30]}
            />
          </SquaredChart>
          <SquaredChart>
            <RadialBarChart
              title={'Score'}
              legend={'de votre objectif'}
              data={0.12}
            />
          </SquaredChart>
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
