import { apiClient } from './axios';

export interface BookingInvoiceSummary {
  available: boolean;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  fileName: string | null;
  mimeType: string | null;
  size: number | null;
  uploadedAt: string | null;
}

/** Mirrors backend limits in bookingInvoice.service.ts */
export const INVOICE_MAX_BYTES = 10 * 1024 * 1024;
export const INVOICE_ACCEPT = 'application/pdf,image/png,image/jpeg,image/webp';
export const INVOICE_NUMBER_PATTERN = /^[A-Za-z0-9/_\-.#]{1,50}$/;

export const invoiceApi = {
  /** Metadata of the invoice uploaded by the Litmus team (available=false until issued). */
  getSummary: async (bookingId: string): Promise<{ success: boolean; data: BookingInvoiceSummary }> => {
    const response = await apiClient.get(`/booking/${bookingId}/invoice`);
    return response.data;
  },

  download: async (bookingId: string): Promise<Blob> => {
    const response = await apiClient.get(`/booking/${bookingId}/invoice/download`, { responseType: 'blob' });
    return response.data as Blob;
  },

  /** Uploads or replaces the invoice document; the customer is notified by email. */
  upload: async (
    bookingId: string,
    payload: { file: File; invoiceNumber?: string; invoiceDate?: string },
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; data: BookingInvoiceSummary }> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    if (payload.invoiceNumber) formData.append('invoiceNumber', payload.invoiceNumber);
    if (payload.invoiceDate) formData.append('invoiceDate', payload.invoiceDate);

    const response = await apiClient.put(`/booking/${bookingId}/invoice`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });
    return response.data;
  },

  remove: async (bookingId: string): Promise<{ success: boolean; data: BookingInvoiceSummary }> => {
    const response = await apiClient.delete(`/booking/${bookingId}/invoice`);
    return response.data;
  },
};
