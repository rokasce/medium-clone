import { BaseAPI } from '@/shared/lib/base-api';
import type {
  NotificationsResponse,
  UnreadCountResponse,
} from '../types/notification';

export class NotificationAPI extends BaseAPI {
  async getNotifications(params?: {
    page?: number;
    pageSize?: number;
    unreadOnly?: boolean;
    type?: string;
  }): Promise<NotificationsResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.get<NotificationsResponse>('/notifications', {
        params,
      })
    );
  }

  async getUnreadCount(): Promise<UnreadCountResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.get<UnreadCountResponse>('/notifications/unread-count')
    );
  }

  async markAsRead(id: string): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.put<void>(`/notifications/${id}/read`)
    );
  }

  async markAllAsRead(): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.put<void>('/notifications/read-all')
    );
  }
}

export const notificationApi = new NotificationAPI();
