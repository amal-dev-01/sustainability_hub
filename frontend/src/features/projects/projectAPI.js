import axiosClient from '../../app/axiosClient';
const projectAPI = {
  list: async (params = {}) => {
    const response = await axiosClient.get('/project/projects/', { params });
    return response.data;
  },

  get: async (id) => {
    const response = await axiosClient.get(`/project/projects/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/project/projects/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/project/projects/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/project/projects/${id}/`);
    return response.data;
  },
  search: async (searchText) => {
    const response = await axiosClient.get("/project/projects/", {
      params: { search: searchText },
    });
    return response.data; 
  },

};

export default projectAPI;
