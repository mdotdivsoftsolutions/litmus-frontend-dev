import { apiClient } from './axios';

export const adminApi = {
  createLab: async (data: any) => {
    const response = await apiClient.post('/admin/lab', data);
    return response.data;
  },

  getLabs: async () => {
    const response = await apiClient.get('/admin/labs');
    return response.data;
  },

  getLabById: async (id: string) => {
    const response = await apiClient.get(`/admin/lab/${id}`);
    return response.data;
  },

  updateLab: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/lab/${id}`, data);
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (data: { userId: string; isActive: boolean }) => {
    const response = await apiClient.patch('/admin/user/status', data);
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  }
};
