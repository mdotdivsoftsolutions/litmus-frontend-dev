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

  getBookings: async () => {
    const response = await apiClient.get('/admin/bookings');
    return response.data;
  },

  getPayments: async () => {
    const response = await apiClient.get('/admin/payments');
    return response.data;
  },

  approveReport: async (id: string) => {
    const response = await apiClient.patch(`/admin/booking/${id}/approve-result`);
    return response.data;
  },

  rejectReport: async (id: string, reason: string) => {
    const response = await apiClient.patch(`/admin/booking/${id}/reject-result`, { reason });
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
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // --- Reviews ---
  getReviews: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  },
  getReviewById: async (id: string) => {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data;
  },
  createReview: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },
  updateReview: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.patch(`/reviews/${id}`, data);
    return response.data;
  },
  deleteReview: async (id: string) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  deleteLab: async (id: string) => {
    const response = await apiClient.delete(`/admin/lab/${id}`);
    return response.data;
  }
};
