import { apiClient } from './axios';

export interface INotificationWorkflowChannel {
  email: boolean;
  whatsapp: boolean;
  template?: string;
  delayHours?: number;
}

export interface INotificationWorkflows {
  orderConfirmation: INotificationWorkflowChannel;
  orderProcessing: INotificationWorkflowChannel;
  shippingUpdates: INotificationWorkflowChannel;
  deliveryUpdates: INotificationWorkflowChannel;
  abandonedCart: INotificationWorkflowChannel;
  supportRequestAdminAlert: INotificationWorkflowChannel;
  customerNotifications: INotificationWorkflowChannel;
}

export interface IPlatformSettingsData {
  _id?: string;
  pickupCities: string[];
  enablePickupSlotSelection: boolean;
  adminWhatsAppNumber?: string;
  adminEmailRecipient?: string;
  notificationWorkflows?: INotificationWorkflows;
  createdAt?: string;
  updatedAt?: string;
}

export const settingsApi = {
  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },
  updateSettings: async (data: Partial<IPlatformSettingsData>) => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data;
  },
  testWhatsApp: async (data: { phoneNumber?: string; message?: string; useTemplate?: boolean; templateName?: string }) => {
    const response = await apiClient.post('/admin/notifications/test-whatsapp', data);
    return response.data;
  },
  triggerAbandonedCartScan: async () => {
    const response = await apiClient.post('/admin/notifications/trigger-abandoned-carts');
    return response.data;
  },
};
