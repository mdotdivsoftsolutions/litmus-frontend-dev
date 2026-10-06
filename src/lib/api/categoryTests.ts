import { apiClient } from './axios';
import { testApi } from './test';

/** DIRECT = linked to the category, ALL = test applies to all categories, NONE = not shown there. */
export type CategoryMembership = 'DIRECT' | 'ALL' | 'NONE';

export interface CategoryTestItem {
  _id: string;
  testName: string;
  type: string;
  price: number;
  offerPrice?: number;
  creatorType?: string;
  /** Number of specific categories the test is linked to (null when it applies to all). */
  categoryCount: number | null;
  membership: CategoryMembership;
}

export interface CategoryTestsChanges {
  add: string[];
  remove: string[];
}

export const categoryTestsApi = {
  list: async (categoryId: string): Promise<CategoryTestItem[]> => {
    const response = await apiClient.get(`/categories/${categoryId}/tests`);
    return response.data?.data || [];
  },

  /** For a category that is not created yet: every test, with "all categories" ones pre-included. */
  listForNewCategory: async (): Promise<CategoryTestItem[]> => {
    const res = await testApi.getTests({ sort: 'name_asc' });
    return (res?.data || []).map((t: any) => ({
      _id: t._id,
      testName: t.testName,
      type: t.metadata?.type || '',
      price: t.price || 0,
      offerPrice: t.offerPrice || undefined,
      creatorType: t.creatorType,
      categoryCount: t.isApplicableToAll ? null : (t.applicableCategories || []).length,
      membership: t.isApplicableToAll ? 'ALL' : 'NONE',
    }));
  },

  update: async (categoryId: string, changes: CategoryTestsChanges) => {
    const response = await apiClient.patch(`/categories/${categoryId}/tests`, changes);
    return response.data?.data as { added: number; removed: number; convertedFromAll: number };
  },
};
