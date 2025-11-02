import axiosClient from '../../app/axiosClient';

const dashboardAPI = {
  getSummary: async () => {
    const response = await axiosClient.get('/project/dashboard/');
    return response.data;
  },
};

export default dashboardAPI;
