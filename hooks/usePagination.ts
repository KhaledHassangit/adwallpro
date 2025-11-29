import { useState, useCallback } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

/**
 * Handle pagination logic
 * Manages page state and calculations
 */
export const usePagination = (options: UsePaginationOptions = {}) => {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = useCallback((newPage: number) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  }, []);

  const goToNextPage = useCallback((totalPages: number) => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    if (newLimit > 0) {
      setLimit(newLimit);
      setPage(1); // Reset to first page when limit changes
    }
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changeLimit,
    reset,
  };
};
