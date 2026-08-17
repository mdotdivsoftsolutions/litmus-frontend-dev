import { apiClient } from './axios';

export const settingsApi = {
  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },
  updateSettings: async (data: { pickupCities?: string[]; enablePickupSlotSelection?: boolean }) => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data;
  },
};
