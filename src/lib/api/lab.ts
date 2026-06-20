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
  },

  getMyLabBookings: async () => {
    const response = await apiClient.get('/lab-portal/bookings');
    return response.data;
  },
  
  updateLabBookingStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/lab-portal/bookings/${id}/status`, { status });
    return response.data;
  },

  updateCollectionDetails: async (id: string, data: { status?: string; collectorName?: string; collectorContact?: string }) => {
    const response = await apiClient.patch(`/lab-portal/bookings/${id}/collection`, data);
    return response.data;
  }
};
