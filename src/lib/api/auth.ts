import { apiClient } from './axios';
import { RegisterInput, LoginInput, SendOtpInput } from '../../../../backend/src/validators/auth.validator';

export const authApi = {
  sendOtp: async (data: SendOtpInput) => {
    const response = await apiClient.post('/auth/send-otp', data);
    return response.data;
  },
  
  register: async (data: RegisterInput & { otp: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginInput) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  }
};
