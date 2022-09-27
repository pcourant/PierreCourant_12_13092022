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

const StyledSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 2vw;
`;

const ChartRectContainer = styled.div`
  grid-row: 1 / 1;
  grid-column: 1 / span 3;
`;

const KeysInfoContainer = styled.div`
  grid-row: 1 / span 2;
  grid-column: 4 / 5;

  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
`;

const energyIcon = new URL('../../assets/energy.svg', import.meta.url);
const chickenIcon = new URL('../../assets/chicken.svg', import.meta.url);
const cheeseburgerIcon = new URL(
  '../../assets/cheeseburger.svg',
  import.meta.url
);
const appleIcon = new URL('../../assets/apple.svg', import.meta.url);

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
        <ChartRectContainer>
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
        </ChartRectContainer>
        <LineChart
          title={'Durée moyenne des sessions'}
          labels={{
            x: '',
            y: '',
            tooltipY: ' min',
          }}
          data={[0, 30, 23, 45, 50, 0, 0, 60, 90]}
        />
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
        <RadialBarChart
          title={'Score'}
          legend={'de votre objectif'}
          data={0.12}
        />
        <KeysInfoContainer>
          <KeyInfoCard
            title={'Calories'}
            data={'1,930kCal'}
            icon={energyIcon}
          />
          <KeyInfoCard title={'Proteines'} data={'155g'} icon={chickenIcon} />
          <KeyInfoCard title={'Glucides'} data={'290g'} icon={appleIcon} />
          <KeyInfoCard title={'Lipides'} data={'50g'} icon={cheeseburgerIcon} />
        </KeysInfoContainer>
      </StyledSection>
    </>
  );
};

Profile.propTypes = {};

export default Profile;
