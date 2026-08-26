import { apiClient } from './axios';

export const categoryApi = {
  getCategories: () => apiClient.get('/categories'),
  getCategory: (id: string) => apiClient.get(`/categories/${id}`),
  createCategory: (data: any) => apiClient.post('/categories', data),
  updateCategory: (id: string, data: any) => apiClient.patch(`/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/categories/${id}`),
  addSubcategory: (categoryId: string, data: { name: string; description?: string; imageUrl?: string }) =>
    apiClient.post(`/categories/${categoryId}/subcategories`, data),
  updateSubcategory: (categoryId: string, subId: string, data: { name?: string; description?: string; imageUrl?: string }) =>
    apiClient.patch(`/categories/${categoryId}/subcategories/${subId}`, data),
  deleteSubcategory: (categoryId: string, subId: string) =>
    apiClient.delete(`/categories/${categoryId}/subcategories/${subId}`),
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
