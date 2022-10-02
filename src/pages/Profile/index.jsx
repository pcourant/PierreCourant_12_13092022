import React from 'react';
import { useParams } from 'react-router-dom';
import {
  formatPerformanceData,
  formatAverageSessionsData,
  formatActivityData,
} from '../../utils/charts';
import styled from 'styled-components';
import HeaderMain from '../../components/HeaderMain';
import KeyInfoCard from '../../components/KeyInfoCard';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import RadarChart from '../../components/RadarChart';
import RadialBarChart from '../../components/RadialBarChart';
import ErrorAPI from '../../components/ErrorAPI';
import Loader from '../../components/Loader';
import UserServices from '../../services/user';

const energyIcon = new URL('../../assets/energy.svg', import.meta.url);
const chickenIcon = new URL('../../assets/chicken.svg', import.meta.url);
const cheeseburgerIcon = new URL(
  '../../assets/cheeseburger.svg',
  import.meta.url
);
const appleIcon = new URL('../../assets/apple.svg', import.meta.url);

/**
 * Render the Profile page of userId
 */
const Profile = () => {
  const { userId } = useParams();

  // Get all user information with UserServices through API calls
  const user = UserServices.useUser(userId);
  const userActivity = UserServices.useActivity(userId);
  const userPerformance = UserServices.usePerformance(userId);
  const userAverageSessions = UserServices.useAverageSessions(userId);

  return (
    <>
      {user.isLoading ? (
        <Loader />
      ) : (
        <>
          {user.error ? (
            <ErrorAPI
              status={
                user.error.response?.status
                  ? `${user.error.response?.status} ${user.error.response?.statusText}`
                  : `${user.error.code}`
              }
              message={
                user.error.response?.status
                  ? user.error.response?.data
                  : user.error.message
              }
            />
          ) : (
            <>
              <HeaderMain
                title={`Bonjour `}
                highlightTitle={user.infos?.firstName}
                subtitle={
                  'Félicitation ! Vous avez explosé vos objectifs hier 👏'
                }
              />
              <StyledSection>
                <ChartRectContainer>
                  {userActivity?.isLoading ? (
                    <Loader />
                  ) : userActivity?.error ? (
                    <ErrorAPI
                      status={`${user.error.response?.status} ${user.error.response?.statusText}`}
                      message={user.error.response?.data}
                    />
                  ) : (
                    <BarChart
                      title={'Activité quotidienne'}
                      labels={{
                        y1: 'Poids (kg)',
                        y2: 'Calories brûlées (kCal)',
                        tooltipY1: 'kg',
                        tooltipY2: 'Kcal',
                      }}
                      data={formatActivityData(userActivity?.sessions)}
                    />
                  )}
                </ChartRectContainer>
                {userAverageSessions?.isLoading ? (
                  <Loader />
                ) : userAverageSessions?.error ? (
                  <ErrorAPI
                    status={`${user.error.response?.status} ${user.error.response?.statusText}`}
                    message={user.error.response?.data}
                  />
                ) : (
                  <LineChart
                    title={'Durée moyenne des sessions'}
                    labels={{
                      tooltipY: ' min',
                    }}
                    data={formatAverageSessionsData(
                      userAverageSessions?.sessions
                    )}
                  />
                )}
                {userPerformance?.isLoading ? (
                  <Loader />
                ) : userPerformance?.error ? (
                  <ErrorAPI
                    status={`${user.error.response?.status} ${user.error.response?.statusText}`}
                    message={user.error.response?.data}
                  />
                ) : (
                  <RadarChart
                    levels={{ count: 5, max: 250 }}
                    features={[
                      'Intensité',
                      'Vitesse',
                      'Force',
                      'Endurance',
                      'Énergie',
                      'Cardio',
                    ]}
                    data={formatPerformanceData(
                      userPerformance?.performance?.data,
                      userPerformance?.performance?.kind
                    )}
                  />
                )}
                <RadialBarChart
                  title={'Score'}
                  legend={'de votre objectif'}
                  data={user.todayScore}
                />
                <KeysInfoContainer>
                  <KeyInfoCard
                    title={'Calories'}
                    data={`${user.keyInfos?.calorieCount}kCal`}
                    icon={energyIcon}
                  />
                  <KeyInfoCard
                    title={'Proteines'}
                    data={`${user.keyInfos?.proteinCount}g`}
                    icon={chickenIcon}
                  />
                  <KeyInfoCard
                    title={'Glucides'}
                    data={`${user.keyInfos?.carbohydrateCount}g`}
                    icon={appleIcon}
                  />
                  <KeyInfoCard
                    title={'Lipides'}
                    data={`${user.keyInfos?.lipidCount}g`}
                    icon={cheeseburgerIcon}
                  />
                </KeysInfoContainer>
              </StyledSection>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Profile;

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
