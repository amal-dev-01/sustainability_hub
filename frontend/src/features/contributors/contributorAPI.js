import axiosClient from '../../app/axiosClient';

const contributorAPI = {
  list: async (params = {}) => {
    const response = await axiosClient.get('/project/contributors/', { params });
    return response.data;
  },

  get: async (id) => {
    const response = await axiosClient.get(`/project/contributors/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/project/contributors/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/project/contributors/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/project/contributors/${id}/`);
    return response.data;
  },

  search: async (searchText) => {
    const response = await axiosClient.get("/project/contributors/", {
      params: { search: searchText },
    });
    return response.data; 
  },

};

export default contributorAPI;
