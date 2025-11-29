import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export interface UseAsyncDataOptions {
  initialLoading?: boolean;
}

/**
 * Generic async data loading hook
 * Handles loading, error, and data states
 */
export const useAsyncData = <T,>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncDataOptions = {}
) => {
  const { initialLoading = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
        ? err.message
        : 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetch();
  }, dependencies);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch };
};
