import { apiClient } from './axios';

export interface ConsultationData {
  name: string;
  business?: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  serviceName: string;
  source: string;
}

export interface ConsultationParams {
  status?: string;
  source?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const consultationApi = {
  createConsultation: (data: ConsultationData) => apiClient.post('/consultations', data),
  getConsultations: (params?: ConsultationParams) => apiClient.get('/consultations', { params }),
  updateStatus: (id: string, status: string) => apiClient.patch(`/consultations/${id}/status`, { status }),
};
