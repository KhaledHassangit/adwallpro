# Migration Guide: Refactoring to Clean Architecture

## Quick Start

This guide shows how to refactor your existing components to use the new hooks and shared components.

---

## Pattern 1: Extracting Date Formatting Logic

### Before
```tsx
function SubscriptionCard({ subscription }) {
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const calculateDaysLeft = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = Math.abs(expiry.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      <p>Created: {formatDate(subscription.createdAt)}</p>
      <p>Days Left: {calculateDaysLeft(subscription.expiresAt)}</p>
    </div>
  );
}
```

### After
```tsx
import { useDateFormatter } from '@/hooks';

function SubscriptionCard({ subscription }) {
  const { formatDate, calculateDaysLeft } = useDateFormatter();

  return (
    <div>
      <p>Created: {formatDate(subscription.createdAt)}</p>
      <p>Days Left: {calculateDaysLeft(subscription.expiresAt)}</p>
    </div>
  );
}
```

**Benefits:**
- Reusable across components
- Testable logic
- Consistent formatting
- DRY principle

---

## Pattern 2: Extracting Subscription Logic

### Before
```tsx
function SubscriptionsList({ subscriptions }) {
  const calculateProgress = (createdAt: string, expiresAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const expiry = new Date(expiresAt);
    const totalTime = expiry.getTime() - created.getTime();
    const elapsedTime = now.getTime() - created.getTime();
    return Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Active', variant: 'default' },
      inactive: { label: 'Inactive', variant: 'destructive' },
      pending: { label: 'Pending', variant: 'outline' },
      expired: { label: 'Expired', variant: 'destructive' },
    };
    return statusMap[status] || { label: status, variant: 'outline' };
  };

  return subscriptions.map(sub => {
    const { label, variant } = getStatusBadge(sub.status);
    const progress = calculateProgress(sub.createdAt, sub.expiresAt);
    return (
      <div key={sub.id}>
        <Badge variant={variant}>{label}</Badge>
        <Progress value={progress} />
      </div>
    );
  });
}
```

### After
```tsx
import { useSubscriptionManager } from '@/hooks';
import { StatusBadge, AsyncBoundary } from '@/components/shared';
import { Progress } from '@/components/ui/progress';

function SubscriptionsList({ subscriptions }) {
  const { calculateProgress, getStatusBadge } = useSubscriptionManager();

  return subscriptions.map(sub => {
    const { label, variant } = getStatusBadge(sub.status);
    const progress = calculateProgress(sub.createdAt, sub.expiresAt);
    return (
      <div key={sub.id}>
        <StatusBadge status={sub.status} />
        <Progress value={progress} />
      </div>
    );
  });
}
```

---

## Pattern 3: Extracting Pagination Logic

### Before
```tsx
function DataList({ data, apiCall }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const goToPage = (p: number) => {
    if (p > 0) setPage(p);
  };

  const goToNextPage = (max: number) => {
    if (page < max) setPage(page + 1);
  };

  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    apiCall({ page, limit });
  }, [page, limit]);

  return (
    <div>
      <button onClick={() => goToPreviousPage()}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => goToNextPage(totalPages)}>Next</button>
    </div>
  );
}
```

### After
```tsx
import { usePagination } from '@/hooks';

function DataList({ data, apiCall, totalPages }) {
  const { page, limit, goToPage, goToNextPage, goToPreviousPage } = usePagination();

  useEffect(() => {
    apiCall({ page, limit });
  }, [page, limit, apiCall]);

  return (
    <div>
      <button onClick={() => goToPreviousPage()}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => goToNextPage(totalPages)}>Next</button>
    </div>
  );
}
```

---

## Pattern 4: Using DataTable Component

### Before
```tsx
function AdminUsersTable({ users, isLoading }) {
  if (isLoading) return <div>Loading...</div>;
  if (!users?.length) return <div>No users</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <Badge>{user.status}</Badge>
            </td>
            <td>
              <Button>Edit</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### After
```tsx
import { DataTable, StatusBadge, AsyncBoundary } from '@/components/shared';
import { Button } from '@/components/ui/button';

function AdminUsersTable({ users, isLoading }) {
  return (
    <AsyncBoundary 
      isLoading={isLoading}
      isEmpty={!users?.length}
      emptyMessage="No users found"
    >
      <DataTable
        data={users}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          {
            key: 'status',
            header: 'Status',
            render: (value) => <StatusBadge status={value} />,
          },
          {
            key: 'id',
            header: 'Actions',
            render: (_, row) => (
              <Button size="sm" onClick={() => handleEdit(row.id)}>
                Edit
              </Button>
            ),
          },
        ]}
      />
    </AsyncBoundary>
  );
}
```

**Benefits:**
- Consistent UI across tables
- Less boilerplate
- Built-in loading state
- Customizable columns

---

## Pattern 5: Using ModalDialog Component

### Before
```tsx
function UserEditDialog({ user, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information
          </DialogDescription>
        </DialogHeader>
        <form>
          <Input value={user.name} />
          <Input value={user.email} />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSave()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### After
```tsx
import { ModalDialog } from '@/components/shared';

function UserEditDialog({ user, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <ModalDialog
      isOpen={open}
      onOpenChange={setOpen}
      title="Edit User"
      description="Update user information"
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSave()}>Save</Button>
        </>
      }
    >
      <form>
        <Input value={user.name} />
        <Input value={user.email} />
      </form>
    </ModalDialog>
  );
}
```

---

## Pattern 6: Using AsyncBoundary Component

### Before
```tsx
function CompanyList({ data, isLoading, error }) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!data?.length) {
    return <p className="text-gray-500">No companies found</p>;
  }

  return (
    <div>
      {data.map(company => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
}
```

### After
```tsx
import { AsyncBoundary } from '@/components/shared';

function CompanyList({ data, isLoading, error }) {
  return (
    <AsyncBoundary 
      isLoading={isLoading}
      error={error}
      isEmpty={!data?.length}
      emptyMessage="No companies found"
    >
      <div>
        {data.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </AsyncBoundary>
  );
}
```

---

## Pattern 7: Using Filter Manager Hook

### Before
```tsx
function ProductFilter() {
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [inStock, setInStock] = useState(false);

  const handleReset = () => {
    setCategory('');
    setPriceMin('');
    setPriceMax('');
    setInStock(false);
  };

  return (
    <div>
      <Select value={category} onChange={(v) => setCategory(v)}>
        <SelectItem value="electronics">Electronics</SelectItem>
      </Select>
      <Input 
        placeholder="Min Price" 
        value={priceMin}
        onChange={(e) => setPriceMin(e.target.value)}
      />
      <Input 
        placeholder="Max Price" 
        value={priceMax}
        onChange={(e) => setPriceMax(e.target.value)}
      />
      <Checkbox 
        checked={inStock}
        onChange={(checked) => setInStock(checked)}
      />
      <Button onClick={handleReset}>Reset</Button>
    </div>
  );
}
```

### After
```tsx
import { useFilterManager } from '@/hooks';

function ProductFilter() {
  const { filters, setFilter, resetAllFilters, hasActiveFilters } = useFilterManager();

  return (
    <div>
      <Select 
        value={filters.category || ''}
        onChange={(v) => setFilter('category', v)}
      >
        <SelectItem value="electronics">Electronics</SelectItem>
      </Select>
      <Input 
        placeholder="Min Price" 
        value={filters.priceMin || ''}
        onChange={(e) => setFilter('priceMin', e.target.value)}
      />
      <Input 
        placeholder="Max Price" 
        value={filters.priceMax || ''}
        onChange={(e) => setFilter('priceMax', e.target.value)}
      />
      <Checkbox 
        checked={filters.inStock || false}
        onChange={(checked) => setFilter('inStock', checked)}
      />
      <Button 
        onClick={resetAllFilters}
        disabled={!hasActiveFilters()}
      >
        Reset
      </Button>
    </div>
  );
}
```

---

## Refactoring Checklist

When refactoring a component, follow this checklist:

- [ ] Identify business logic (calculations, state management, API calls)
- [ ] Extract logic to appropriate hook
- [ ] Replace inline conditional rendering with `AsyncBoundary`
- [ ] Replace inline tables with `DataTable`
- [ ] Replace inline modals with `ModalDialog`
- [ ] Replace inline status displays with `StatusBadge`
- [ ] Remove old utilities/helper functions
- [ ] Test the refactored component
- [ ] Update imports
- [ ] Update tests (if applicable)

---

## Testing the Refactored Code

### Hook Test Example
```tsx
import { renderHook, act } from '@testing-library/react';
import { useDateFormatter } from '@/hooks';

describe('useDateFormatter', () => {
  it('formats date correctly', () => {
    const { result } = renderHook(() => useDateFormatter());
    const formatted = result.current.formatDate('2024-01-15');
    expect(formatted).toBe('Jan 15, 2024');
  });

  it('calculates days left correctly', () => {
    const { result } = renderHook(() => useDateFormatter());
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const daysLeft = result.current.calculateDaysLeft(futureDate.toISOString());
    expect(daysLeft).toBe(5);
  });
});
```

---

## Common Mistakes to Avoid

❌ **Don't mix logic and UI:**
```tsx
// BAD - Logic in component
function Card({ item }) {
  const formatted = new Date(item.date).toLocaleDateString();
  return <div>{formatted}</div>;
}
```

✅ **Do extract logic to hooks:**
```tsx
// GOOD - Logic in hook
import { useDateFormatter } from '@/hooks';

function Card({ item }) {
  const { formatDate } = useDateFormatter();
  return <div>{formatDate(item.date)}</div>;
}
```

❌ **Don't create new state for every filter:**
```tsx
// BAD
const [name, setName] = useState('');
const [category, setCategory] = useState('');
const [price, setPrice] = useState('');
```

✅ **Use filter manager:**
```tsx
// GOOD
const { filters, setFilter } = useFilterManager();
// Use: filters.name, filters.category, filters.price
```

---

## Performance Optimization

All hooks use `useCallback` to prevent unnecessary re-renders:

```tsx
// The hook already optimizes this
const { formatDate } = useDateFormatter();
// formatDate is stable and won't cause re-renders

const { calculateProgress } = useSubscriptionManager();
// calculateProgress is also stable
```

---

## Next Steps

1. **This Week**: Refactor 2-3 high-traffic pages
2. **Next Week**: Refactor remaining pages
3. **End of Sprint**: Remove old unused code
4. **Testing**: Add unit tests for all hooks

