import { useCallback } from 'react';

/**
 * Format ISO date string to locale-specific format
 */
export const useDateFormatter = () => {
  const formatDate = useCallback((isoDate: string | undefined) => {
    if (!isoDate) return 'N/A';
    try {
      return new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  const formatDateTime = useCallback((isoDate: string | undefined) => {
    if (!isoDate) return 'N/A';
    try {
      return new Date(isoDate).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  const calculateDaysLeft = useCallback((expiresAt: string | undefined) => {
    if (!expiresAt) return 0;
    try {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diffTime = Math.abs(expiry.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  }, []);

  return { formatDate, formatDateTime, calculateDaysLeft };
};
