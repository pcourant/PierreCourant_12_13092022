import React from 'react';
import { useParams } from 'react-router-dom';
import { useAxiosGet } from '../../utils/hooks';
import styled from 'styled-components';
import colors from '../../utils/styles/colors';
import PropTypes from 'prop-types';
import HeaderMain from '../../components/HeaderMain';
import KeyInfoCard from '../../components/KeyInfoCard';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import RadarChart from '../../components/RadarChart';
import RadialBarChart from '../../components/RadialBarChart';
import ErrorAPI from '../../components/ErrorAPI';
import Loader from '../../components/Loader';

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

function formatPerformanceData(data, kind) {
  if (data && kind) {
    const dataSorted = [
      'intensity',
      'speed',
      'strength',
      'endurance',
      'energy',
      'cardio',
    ];
    for (const [key, k] of Object.entries(kind)) {
      const value = data.find((obj) => obj.kind === +key)?.value;
      // console.log(value);
      if (value !== undefined) {
        const index = dataSorted.indexOf(k);
        // console.log(k, index);
        if (index > -1) {
          dataSorted[index] = value;
          // console.log(dataSorted[index]);
        }
      }
    }
    return dataSorted;
  }
}

function formatActivityData(data) {
  return data?.map((activity) => ({
    x: new Date(activity?.day).getDate(),
    y1: activity?.kilogram,
    y2: activity?.calories,
  }));
}

function formatAverageSessionsData(sessions) {
  const dayOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const result = sessions?.map((session) => ({
    xTick: dayOfWeek[session?.day % 7],
    value: session?.sessionLength,
  }));

  if (result?.length < 9) {
    result.unshift(result[0]);
  }
  if (result?.length < 9) {
    result.push(result[result.length - 1]);
  }

  return result;
}

const Profile = (props) => {
  const { userId } = useParams();
  const user = useAxiosGet(`http://localhost:3000/user/${userId}`);
  const userActivity = useAxiosGet(
    `http://localhost:3000/user/${userId}/activity`
  );
  const userPerformance = useAxiosGet(
    `http://localhost:3000/user/${userId}/performance`
  );
  const userAverageSessions = useAxiosGet(
    `http://localhost:3000/user/${userId}/average-sessions`
  );
  const userInfos = user?.data?.userInfos;
  const userTodayScore = user?.data?.todayScore ?? user?.data?.score;
  const userKeyInfos = user?.data?.keyData;
  // const userKeyInfos = user?.data?.keyData;

  // console.log(user?.isLoading);
  // console.log(userAverageSessions?.data?.sessions);
  // console.log(formatAverageSessionsData(userAverageSessions?.data?.sessions));
  // console.log(userAverageSessions?.data);
  console.log(user?.data);
  // console.log(user?.error?.response?.status);
  // console.log(user?.error?.response?.statusText);
  // console.log(user?.error?.response?.data);

  return (
    <>
      {user?.isLoading ? (
        <Loader />
      ) : (
        <>
          {user?.error ? (
            <ErrorAPI
              status={`${user?.error?.response?.status} ${user?.error?.response?.statusText}`}
              message={user?.error?.response?.data}
            />
          ) : (
            <>
              <HeaderMain
                title={`Bonjour `}
                firstName={userInfos?.firstName}
                subtitle={
                  'Félicitation ! Vous avez explosé vos objectifs hier 👏'
                }
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
                    data={formatActivityData(userActivity?.data?.sessions)}
                  />
                </ChartRectContainer>
                <LineChart
                  title={'Durée moyenne des sessions'}
                  labels={{
                    tooltipY: ' min',
                  }}
                  data={formatAverageSessionsData(
                    userAverageSessions?.data?.sessions
                  )}
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
                  data={formatPerformanceData(
                    userPerformance?.data?.data,
                    userPerformance?.data?.kind
                  )}
                />
                <RadialBarChart
                  title={'Score'}
                  legend={'de votre objectif'}
                  data={userTodayScore}
                />
                <KeysInfoContainer>
                  <KeyInfoCard
                    title={'Calories'}
                    data={`${userKeyInfos?.calorieCount}kCal`}
                    icon={energyIcon}
                  />
                  <KeyInfoCard
                    title={'Proteines'}
                    data={`${userKeyInfos?.proteinCount}g`}
                    icon={chickenIcon}
                  />
                  <KeyInfoCard
                    title={'Glucides'}
                    data={`${userKeyInfos?.carbohydrateCount}g`}
                    icon={appleIcon}
                  />
                  <KeyInfoCard
                    title={'Lipides'}
                    data={`${userKeyInfos?.lipidCount}g`}
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

Profile.propTypes = {};

export default Profile;
