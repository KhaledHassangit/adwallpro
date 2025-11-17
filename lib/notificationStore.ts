import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Notification, 
  fetchNotifications, 
  markNotificationAsRead,
  markAllNotificationsAsRead, 
  deleteNotification 
} from '@/lib/notificationService';

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  unreadCount: number;
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      unreadCount: 0,
      
      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const notifications = await fetchNotifications();
          const unreadCount = notifications.filter(n => !n.read).length;
          
          set({ 
            notifications, 
            isLoading: false, 
            unreadCount 
          });
        } catch (error) {
          console.error("Error fetching notifications:", error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
            isLoading: false 
          });
        }
      },
      
      markAsRead: async (id: string) => {
        try {
          await markNotificationAsRead(id);
          
          set(state => ({
            notifications: state.notifications.map(n => 
              n._id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }));
        } catch (error) {
          console.error("Error marking notification as read:", error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark notification as read'
          });
        }
      },
      
      markAllAsRead: async () => {
        try {
          await markAllNotificationsAsRead();
          
          set(state => ({
            notifications: state.notifications.map(n => ({ ...n, read: true })),
            unreadCount: 0
          }));
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
          });
        }
      },
      
      removeNotification: async (id: string) => {
        try {
          await deleteNotification(id);
          
          const notification = get().notifications.find(n => n._id === id);
          const wasUnread = notification?.read === false;
          
          set(state => ({
            notifications: state.notifications.filter(n => n._id !== id),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          }));
        } catch (error) {
          console.error("Error deleting notification:", error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete notification'
          });
        }
      }
    }),
    {
      name: 'notification-store'
    }
  )
);