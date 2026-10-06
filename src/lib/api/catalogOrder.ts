import { apiClient } from './axios';

/** Catalog collections that support a storefront display order (priority). */
export type CatalogEntity = 'tests' | 'packages';

export interface DisplayOrderUpdate {
  id: string;
  /** 1 = shown first; null clears the priority. */
  displayOrder: number | null;
}

export interface DisplayOrderImportResult {
  totalRows: number;
  applied: number;
  prioritised: number;
  cleared: number;
  modified: number;
  failed: { rowNumber: number; reason: string }[];
}

export const DISPLAY_ORDER_MAX = 100000;

export const catalogOrderApi = {
  update: async (entity: CatalogEntity, items: DisplayOrderUpdate[]) => {
    const response = await apiClient.patch(`/${entity}/display-order`, { items });
    return response.data;
  },

  exportSheet: async (entity: CatalogEntity): Promise<Blob> => {
    const response = await apiClient.get(`/${entity}/display-order/export`, { responseType: 'blob' });
    return response.data as Blob;
  },

  importSheet: async (entity: CatalogEntity, file: File): Promise<{ data: DisplayOrderImportResult; message?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/${entity}/display-order/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
