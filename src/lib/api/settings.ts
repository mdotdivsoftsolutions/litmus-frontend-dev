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

export interface ICourierAddress {
  facilityName: string;
  attention: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  workingHours: string;
}

/** A Litmus office shown at checkout to customers from the states it serves. */
export interface IRegionalOffice extends ICourierAddress {
  _id?: string;
  /** Admin label, e.g. "Chennai" or "Kochi". */
  name: string;
  states: string[];
  /** Shown when the customer's state matches no office. */
  isDefault: boolean;
  isActive: boolean;
}

export interface IPlatformSettingsData {
  _id?: string;
  pickupCities: string[];
  enablePickupSlotSelection: boolean;
  adminWhatsAppNumber?: string;
  adminEmailRecipient?: string;
  notificationWorkflows?: INotificationWorkflows;
  courierAddress?: ICourierAddress;
  regionalOffices?: IRegionalOffice[];
  /** Highest Litmus special discount (% of subtotal) admins may give on assisted bookings. */
  maxSpecialDiscountPercent?: number;
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
  /** Replaces the full regional office list (validated on the server). */
  updateRegionalOffices: async (offices: IRegionalOffice[]) => {
    const response = await apiClient.put('/settings/regional-offices', { offices });
    return response.data as { success: boolean; data: IRegionalOffice[]; message?: string };
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
