import axiosClient from '../../app/axiosClient';

const authAPI = {
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login/', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await axiosClient.post('/auth/logout/');
    return response.data;
  }
};

export default authAPI;
