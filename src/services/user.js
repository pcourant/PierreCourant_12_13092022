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

export default UserServices;
