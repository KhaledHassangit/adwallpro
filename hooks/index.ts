/**
 * Custom Hooks Library
 * 
 * This directory contains custom React hooks that extract business logic
 * from UI components, following the separation of concerns pattern.
 * 
 * Usage Pattern:
 * const { data, isLoading } = useAsyncData(fetchFn);
 * const { page, goToPage } = usePagination();
 * const { filters, setFilter } = useFilterManager();
 */

export { useDateFormatter } from './useDateFormatter';
export { useSubscriptionManager } from './useSubscriptionManager';
export { usePagination } from './usePagination';
export { useAsyncData } from './useAsyncData';
export { useFilterManager } from './useFilterManager';

// Re-export common hooks from UI library
export { useToast } from '@/components/ui/use-toast';
export { useIsMobile } from '@/components/ui/use-mobile';
