import { apiClient } from './axios';

export type MissedChatStatus = 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'UNREACHABLE';
export type MissedChatReason = 'QUEUE_TIMEOUT' | 'USER_CANCELLED';
export type MissedChatStatusFilter = 'ALL' | MissedChatStatus;

export interface MissedChatNote {
  _id?: string;
  authorName?: string;
  note: string;
  createdAt: string;
}

export interface MissedChat {
  _id: string;
  sessionId: string;
  userType: 'USER' | 'GUEST' | string;
  userId?: { _id: string; firstName?: string; lastName?: string; email?: string; phone?: string } | string | null;
  contact?: { name?: string; phone?: string; email?: string };
  initialQuery?: string;
  reason: MissedChatReason;
  attempts: number;
  queuedAt: string;
  missedAt: string;
  waitDurationSec: number;
  followUpStatus: MissedChatStatus;
  followUpNotes: MissedChatNote[];
  handledBy?: { _id: string; firstName?: string; lastName?: string } | string | null;
  handledAt?: string;
}

export interface MissedChatListParams {
  status?: MissedChatStatusFilter;
  reason?: 'ALL' | MissedChatReason;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const MISSED_CHAT_STATUS_LABELS: Record<MissedChatStatus, string> = {
  PENDING: 'Pending',
  CONTACTED: 'Contacted',
  RESOLVED: 'Resolved',
  UNREACHABLE: 'Unreachable',
};

export const missedChatApi = {
  list: async (params: MissedChatListParams): Promise<{ data: MissedChat[]; meta: PaginationMeta }> => {
    const response = await apiClient.get('/chat/missed', { params });
    return response.data;
  },

  counts: async (): Promise<{ data: Record<MissedChatStatusFilter, number> }> => {
    const response = await apiClient.get('/chat/missed/counts');
    return response.data;
  },

  updateFollowUp: async (id: string, payload: { status?: MissedChatStatus; note?: string }): Promise<{ data: MissedChat }> => {
    const response = await apiClient.patch(`/chat/missed/${id}`, payload);
    return response.data;
  },
};
