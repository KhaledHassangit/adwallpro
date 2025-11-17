import { getAuthCookie } from "@/lib/auth";

const API_BASE = "http://72.60.178.180:8000/api/v1";

const extractNotificationsPayload = (raw: any): Notification[] => {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw as Notification[];
  }

  if (Array.isArray(raw?.data)) {
    return raw.data as Notification[];
  }

  if (Array.isArray(raw?.data?.data)) {
    return raw.data.data as Notification[];
  }

  return [];
};

const extractNotificationPayload = (raw: any): Notification => {
  if (!raw) {
    throw new Error("Notification payload is empty");
  }

  if (raw.data) {
    return extractNotificationPayload(raw.data);
  }

  return raw as Notification;
};

export interface Notification {
  _id: string;
  user: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const token = getAuthCookie();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE}/notifications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  const data = await response.json();
  return extractNotificationsPayload(data.data ?? data);
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const token = getAuthCookie();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }

  const data = await response.json();
  return extractNotificationPayload(data.data ?? data);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const token = getAuthCookie();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE}/notifications/read-all`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
};

export const deleteNotification = async (id: string): Promise<void> => {
  const token = getAuthCookie();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE}/notifications/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
};