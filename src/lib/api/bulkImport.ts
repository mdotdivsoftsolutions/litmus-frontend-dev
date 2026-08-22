import { apiClient } from './axios';

export interface ImportSummary {
  totalRows: number;
  created: number;
  updated: number;
  failed: number;
  errors: { row: number; item?: string; reason: string }[];
}

export interface BulkImportResponse {
  success: boolean;
  message: string;
  summary?: ImportSummary;
  results?: Record<string, ImportSummary>;
}

export const bulkImportApi = {
  importCategories: async (file: File, onProgress?: (percent: number) => void): Promise<BulkImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/admin/bulk-import/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  importTests: async (file: File, onProgress?: (percent: number) => void): Promise<BulkImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/admin/bulk-import/tests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  importPackages: async (file: File, onProgress?: (percent: number) => void): Promise<BulkImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/admin/bulk-import/packages', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  importLaboratories: async (file: File, onProgress?: (percent: number) => void): Promise<BulkImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/admin/bulk-import/laboratories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  importMaster: async (file: File, onProgress?: (percent: number) => void): Promise<BulkImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/admin/bulk-import/master', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },
};
