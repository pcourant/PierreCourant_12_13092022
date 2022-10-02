// ************************* API call on port 3000 *******************************
import { useAxiosGet } from '../utils/hooks';

/**
 * Services to fetch user data
 * @see {@link https://github.com/OpenClassrooms-Student-Center/P9-front-end-dashboard|Backend API} for further information.
 */
const UserServices = {
  /**
   * Fetch information from a user
   * @param {Number} userId
   * @returns {Object.<isLoading: Boolean, error: Boolean, userInfos: Object.<firstName: String, lastName: String, age: Integer>, todayScore: Number{0-1}, keyData: Object.<calorieCount: Number, proteinCount: Number, carbohydrateCount: Number, lipidCount: Number>>}
   */
  useUser: function (userId) {
    const user = useAxiosGet(`http://localhost:3000/user/${userId}`);

    return {
      isLoading: user.isLoading,
      error: user.error,
      userInfos: user.data?.userInfos,
      todayScore: user.data?.todayScore ?? user?.data?.score,
      keyData: user.data?.keyData,
    };
  },

  /**
   * Fetch user's activity day by day with kilograms and calories
   * @param {Number} userId
   * @returns {Object.<isLoading: Boolean, error: Boolean, sessions: Array.<{day: String, kilogram: Number, calories: Number}>>}
   */
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

  /**
   * Fetch the average sessions of a user per day. The week starts on Monday.
   * @param {Number} userId
   * @returns {Object.<isLoading: Boolean, error: Boolean, sessions: Array.<{day: Integer, sessionLength: Number}>>}
   */
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

  /**
   * Fetch a user's performance (energy, endurance, etc.).
   * @param {Number} userId
   * @returns {Object.<isLoading: Boolean, error: Boolean, kind: Object.<1: String, 2: String, 3: String, 4: String, 5: String, 6: String>, data: Array.<{value: Number, kind: Integer}>>}
   */
  usePerformance: function (userId) {
    const performance = useAxiosGet(
      `http://localhost:3000/user/${userId}/performance`
    );
    return {
      isLoading: performance.isLoading,
      error: performance.error,
      performance: {
        kind: performance.data?.kind,
        data: performance.data?.data,
      },
    };
  },
};

// ************************* Mocked API *******************************
// import {
//   USER_MAIN_DATA,
//   USER_ACTIVITY,
//   USER_AVERAGE_SESSIONS,
//   USER_PERFORMANCE,
// } from '../data';
// const UserServices = {
//   useUser: function (userId) {
//     const user = USER_MAIN_DATA.find((user) => user.id === +userId);

//     return {
//       isLoading: false,
//       error: user
//         ? null
//         : { response: { status: 404, statusText: 'User not found' } },
//       userInfos: user?.userInfos,
//       todayScore: user?.todayScore ?? user?.score,
//       keyData: user?.keyData,
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
