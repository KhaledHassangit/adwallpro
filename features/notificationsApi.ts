// features/notificationsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  status: string;
  message: string;
  data: {
    results: number;
    data: {
      notifications: Notification[];
    };
  };
}

export interface NotificationFilters {
  type?: 'success' | 'error' | 'warning' | 'info';
  userId?: string;
  page?: number;
  limit?: number;
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    // Get all notifications for current user
    getNotifications: builder.query<NotificationsResponse, NotificationFilters>({
      query: (filters) => ({
        url: '/notifications',
        method: 'GET',
        params: filters,
        withToken: true,
      }),
      providesTags: ['Notification'],
      // Transform the response to match the expected structure
      transformResponse: (response: any) => {
        return {
          status: response.status,
          message: response.message,
          data: {
            results: response.data.results,
            data: {
              notifications: response.data.data.notifications
            }
          }
        };
      },
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
        withToken: true,
      }),
      invalidatesTags: ['Notification'],
    }),

    // Mark a specific notification as read
    markAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
        withToken: true,
      }),
      invalidatesTags: ['Notification'],
    }),

    // Delete a notification
    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;