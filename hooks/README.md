# Custom Hooks Library

This directory contains custom React hooks that extract business logic from UI components, following the **separation of concerns** pattern.

## 📚 Available Hooks

### `useDateFormatter()`
Handles all date formatting and calculations related to dates.

**Returns:**
```typescript
{
  formatDate: (isoDate: string) => string,
  formatDateTime: (isoDate: string) => string,
  calculateDaysLeft: (expiresAt: string) => number
}
```

**Example:**
```tsx
const { formatDate, calculateDaysLeft } = useDateFormatter();

// Use in component
<div>{formatDate(subscription.createdAt)}</div>
<div>{calculateDaysLeft(subscription.expiresAt)} days left</div>
```

---

### `useSubscriptionManager()`
Manages subscription-related calculations and status logic.

**Returns:**
```typescript
{
  calculateProgress: (createdAt: string, expiresAt: string) => number,
  getStatusBadge: (status: string) => { label: string, variant: string },
  isSubscriptionActive: (status: string) => boolean,
  isSubscriptionExpired: (expiresAt: string) => boolean
}
```

**Example:**
```tsx
const { calculateProgress, getStatusBadge } = useSubscriptionManager();

const progress = calculateProgress(sub.createdAt, sub.expiresAt);
const { label, variant } = getStatusBadge(sub.status);
```

---

### `usePagination(options)`
Handles pagination state and navigation logic.

**Options:**
```typescript
{
  initialPage?: number,    // default: 1
  initialLimit?: number    // default: 10
}
```

**Returns:**
```typescript
{
  page: number,
  limit: number,
  goToPage: (page: number) => void,
  goToNextPage: (totalPages: number) => void,
  goToPreviousPage: () => void,
  changeLimit: (limit: number) => void,
  reset: () => void
}
```

**Example:**
```tsx
const { page, limit, goToPage, goToNextPage } = usePagination({
  initialPage: 1,
  initialLimit: 10
});

// Use in component
<Button onClick={() => goToNextPage(totalPages)}>Next</Button>
```

---

### `useAsyncData(fetchFn, dependencies, options)`
Generic async data loading with error handling.

**Parameters:**
```typescript
fetchFn: () => Promise<T>        // Function that fetches data
dependencies: any[]              // React dependency array
options: {
  initialLoading?: boolean
}
```

**Returns:**
```typescript
{
  data: T | null,
  isLoading: boolean,
  error: string | null,
  refetch: () => Promise<void>
}
```

**Example:**
```tsx
const { data, isLoading, error, refetch } = useAsyncData(
  async () => {
    const res = await fetch('/api/companies');
    return res.json();
  },
  [id] // refetch when id changes
);

// Use in component with AsyncBoundary
<AsyncBoundary isLoading={isLoading} error={error} isEmpty={!data?.length}>
  <CompanyList companies={data} />
</AsyncBoundary>
```

---

### `useFilterManager(options)`
Manages filter state across components.

**Options:**
```typescript
{
  initialFilters?: Record<string, any>
}
```

**Returns:**
```typescript
{
  filters: Record<string, any>,
  setFilter: (key: string, value: any) => void,
  setMultipleFilters: (filters: Record<string, any>) => void,
  resetFilter: (key: string) => void,
  resetAllFilters: () => void,
  hasActiveFilters: () => boolean
}
```

**Example:**
```tsx
const { filters, setFilter, resetAllFilters, hasActiveFilters } = useFilterManager({
  initialFilters: { category: 'electronics' }
});

// Use in component
<Select 
  value={filters.category || ''}
  onChange={(v) => setFilter('category', v)}
/>
<Button onClick={resetAllFilters} disabled={!hasActiveFilters()}>
  Reset Filters
</Button>
```

---

## 🎯 When to Use Each Hook

| Hook | Use When | Example |
|------|----------|---------|
| `useDateFormatter` | Need to format or calculate dates | Showing subscription expiry date |
| `useSubscriptionManager` | Working with subscription data | Admin subscription dashboard |
| `usePagination` | Displaying paginated data | User list, product catalog |
| `useAsyncData` | Fetching data from API | Loading companies, users, etc. |
| `useFilterManager` | Multiple filters on one component | Search with multiple criteria |

---

## 💡 Best Practices

### ✅ DO
```tsx
// Extract logic to hook
const { formatDate } = useDateFormatter();
return <div>{formatDate(date)}</div>;

// Reuse across components
// Both SubscriptionsList and SubscriptionCard can use it

// Make hooks small and focused
// useDateFormatter only handles dates
```

### ❌ DON'T
```tsx
// Don't put everything in one mega-hook
const useEverything = () => {
  // Bad: Too many responsibilities
};

// Don't repeat hook creation
// Bad: Creating same logic in multiple files
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
// Should use: usePagination hook instead
```

---

## 📝 Creating New Hooks

When creating a new hook:

1. **Name it clearly**: `use[Feature]` pattern
2. **Document it**: Add JSDoc comments
3. **Type it**: Use TypeScript interfaces
4. **Test it**: Add unit tests
5. **Export it**: Add to `index.ts`

**Template:**
```typescript
import { useCallback, useState } from 'react';

/**
 * Brief description of what the hook does
 * 
 * @param options Configuration options
 * @returns Object with hook functionality
 */
export const useMyHook = (options?: MyHookOptions) => {
  const [state, setState] = useState(null);

  const method = useCallback((arg) => {
    // Implementation
  }, [dependencies]);

  return { state, method };
};
```

---

## 🧪 Testing Hooks

All hooks should be tested independently:

```typescript
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('initializes with correct values', () => {
    const { result } = renderHook(() => usePagination({ 
      initialPage: 1, 
      initialLimit: 10 
    }));
    
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
  });

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.goToNextPage(5);
    });
    
    expect(result.current.page).toBe(2);
  });
});
```

---

## 📦 Tree Structure

```
hooks/
├── index.ts                      (Main exports)
├── useDateFormatter.ts           (Date utilities)
├── useSubscriptionManager.ts     (Subscription logic)
├── usePagination.ts              (Pagination state)
├── useAsyncData.ts               (Data loading)
├── useFilterManager.ts           (Filter state)
└── __tests__/                    (Tests - optional but recommended)
    ├── useDateFormatter.test.ts
    ├── usePagination.test.ts
    └── ...
```

---

## 🚀 Quick Start Example

```tsx
import React from 'react';
import {
  useDateFormatter,
  usePagination,
  useAsyncData,
} from '@/hooks';

function SubscriptionsList() {
  const { formatDate } = useDateFormatter();
  const { page, limit, goToNextPage } = usePagination();
  const { data: subs, isLoading } = useAsyncData(
    () => fetch('/api/subscriptions?page=' + page).then(r => r.json()),
    [page]
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {subs?.map(sub => (
        <div key={sub.id}>
          <h3>{sub.name}</h3>
          <p>Created: {formatDate(sub.createdAt)}</p>
        </div>
      ))}
      <button onClick={() => goToNextPage(subs?.totalPages)}>
        Next Page
      </button>
    </div>
  );
}

export default SubscriptionsList;
```

---

## 📚 Resources

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Testing Library Hooks](https://react-hooks-testing-library.com/)

---

**Need help?** See `MIGRATION_GUIDE.md` for usage examples.
