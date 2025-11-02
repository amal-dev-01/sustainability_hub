import axiosClient from '../../app/axiosClient';

const taskAPI = {
  list: async (params = {}) => {
    const response = await axiosClient.get('/project/tasks/', { params });
    return response.data;
  },

  get: async (id) => {
    const response = await axiosClient.get(`/project/tasks/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/project/tasks/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/project/tasks/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/project/tasks/${id}/`);
    return response.data;
  },
  overdue: async (params) => {
    const response = await axiosClient.get('/project/tasks/overdue/', { params });
    return response.data;
  },

};

export default taskAPI;
