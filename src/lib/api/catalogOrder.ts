import { apiClient } from './axios';

/** Catalog collections that support a storefront display order (priority). */
export type CatalogEntity = 'tests' | 'packages';

export interface DisplayOrderUpdate {
  id: string;
  /** 1 = shown first; null clears the priority. */
  displayOrder: number | null;
}

export const DISPLAY_ORDER_MAX = 100000;

export const catalogOrderApi = {
  update: async (entity: CatalogEntity, items: DisplayOrderUpdate[]) => {
    const response = await apiClient.patch(`/${entity}/display-order`, { items });
    return response.data;
  },
};
