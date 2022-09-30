import {
  USER_MAIN_DATA,
  USER_ACTIVITY,
  USER_AVERAGE_SESSIONS,
  USER_PERFORMANCE,
} from '../data';
import { useAxiosGet } from '../utils/hooks';

const UserServices = {
  useUser: function (userId) {
    const user = useAxiosGet(`http://localhost:3000/user/${userId}`);

    return {
      isLoading: user.isLoading,
      error: user.error,
      infos: user.data?.userInfos,
      todayScore: user.data?.todayScore ?? user?.data?.score,
      keyInfos: user.data?.keyData,
    };
  },

  useActivity: function (userId) {
    const activity = useAxiosGet(
      `http://localhost:3000/user/${userId}/activity`
    );
    return {
      isLoading: activity.isLoading,
      error: activity.error,
      sessions: activity.data?.sessions,
    };
  },

  usePerformance: function (userId) {
    const performance = useAxiosGet(
      `http://localhost:3000/user/${userId}/performance`
    );
    return {
      isLoading: performance.isLoading,
      error: performance.error,
      performance: {
        data: performance.data?.data,
        kind: performance.data?.kind,
      },
    };
  },

  useAverageSessions: function (userId) {
    const averageSessions = useAxiosGet(
      `http://localhost:3000/user/${userId}/average-sessions`
    );
    return {
      isLoading: averageSessions.isLoading,
      error: averageSessions.error,
      sessions: averageSessions.data?.sessions,
    };
  },
};

// const UserServices = {
//   useUser: function (userId) {
//     const user = USER_MAIN_DATA.find((user) => user.id === +userId);

//     return {
//       isLoading: false,
//       error: user
//         ? null
//         : { response: { status: 404, statusText: 'User not found' } },
//       infos: user?.userInfos,
//       todayScore: user?.todayScore ?? user?.score,
//       keyInfos: user?.keyData,
//     };
//   },

//   useActivity: function (userId) {
//     const activity = USER_ACTIVITY.find((user) => user.userId === +userId);

//     return {
//       isLoading: false,
//       error: activity
//         ? null
//         : { response: { status: 404, statusText: 'User not found' } },
//       sessions: activity?.sessions,
//     };
//   },

//   usePerformance: function (userId) {
//     const performance = USER_PERFORMANCE.find(
//       (user) => user.userId === +userId
//     );

//     return {
//       isLoading: false,
//       error: performance
//         ? null
//         : { response: { status: 404, statusText: 'User not found' } },
//       performance: {
//         data: performance?.data,
//         kind: performance?.kind,
//       },
//     };
//   },

//   useAverageSessions: function (userId) {
//     const averageSessions = USER_AVERAGE_SESSIONS.find(
//       (user) => user.userId === +userId
//     );

//     return {
//       isLoading: false,
//       error: averageSessions
//         ? null
//         : { response: { status: 404, statusText: 'User not found' } },
//       sessions: averageSessions?.sessions,
//     };
//   },
// };

export default UserServices;
