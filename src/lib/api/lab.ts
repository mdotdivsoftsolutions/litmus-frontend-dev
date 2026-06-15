import { apiClient } from './axios';

export const labApi = {
  getLabsPublic: async (params?: { lat?: number; lng?: number; location?: string, isTrusted?: boolean, search?: string }) => {
    const response = await apiClient.get('/labs', { params });
    return response.data;
  },
  
  getLabByIdPublic: async (id: string) => {
    const response = await apiClient.get(`/labs/${id}`);
    return response.data;
  },

  submitResult: async (bookingId: string, data: { reportUrl: string }) => {
    const response = await apiClient.patch(`/labs/booking/${bookingId}/result`, data);
    return response.data;
  }
};
