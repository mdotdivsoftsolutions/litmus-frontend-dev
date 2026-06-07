import { apiClient } from './axios';

export const labApi = {
  getLabsPublic: async (params?: { lat?: number; lng?: number; location?: string }) => {
    const response = await apiClient.get('/lab', { params });
    return response.data;
  },
  
  getLabByIdPublic: async (id: string) => {
    const response = await apiClient.get(`/lab/${id}`);
    return response.data;
  },

  submitResult: async (bookingId: string, data: { reportUrl: string }) => {
    const response = await apiClient.patch(`/lab/booking/${bookingId}/result`, data);
    return response.data;
  }
};
