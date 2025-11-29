import { useState, useCallback } from 'react';

export interface UseFilterOptions {
  initialFilters?: Record<string, any>;
}

/**
 * Handle filtering and search logic
 * Separates filter state from UI
 */
export const useFilterManager = (options: UseFilterOptions = {}) => {
  const { initialFilters = {} } = options;
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setMultipleFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const resetFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const resetAllFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const hasActiveFilters = useCallback(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return {
    filters,
    setFilter,
    setMultipleFilters,
    resetFilter,
    resetAllFilters,
    hasActiveFilters,
  };
};
