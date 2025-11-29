import { useCallback } from 'react';

/**
 * Handle subscription data and calculations
 * Separates business logic from UI
 */
export const useSubscriptionManager = () => {
  const calculateProgress = useCallback(
    (createdAt: string | undefined, expiresAt: string | undefined) => {
      if (!createdAt || !expiresAt) return 0;
      try {
        const now = new Date();
        const created = new Date(createdAt);
        const expiry = new Date(expiresAt);

        const totalTime = expiry.getTime() - created.getTime();
        const elapsedTime = now.getTime() - created.getTime();

        return Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
      } catch {
        return 0;
      }
    },
    []
  );

  const getStatusBadge = useCallback(
    (status: string) => {
      const statusMap: Record<
        string,
        { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }
      > = {
        active: { label: 'Active', variant: 'default' },
        inactive: { label: 'Inactive', variant: 'destructive' },
        pending: { label: 'Pending', variant: 'outline' },
        expired: { label: 'Expired', variant: 'destructive' },
      };
      return statusMap[status] || { label: status, variant: 'outline' };
    },
    []
  );

  const isSubscriptionActive = useCallback((status: string): boolean => {
    return status === 'active';
  }, []);

  const isSubscriptionExpired = useCallback((expiresAt: string | undefined): boolean => {
    if (!expiresAt) return false;
    try {
      return new Date(expiresAt) < new Date();
    } catch {
      return false;
    }
  }, []);

  return {
    calculateProgress,
    getStatusBadge,
    isSubscriptionActive,
    isSubscriptionExpired,
  };
};
