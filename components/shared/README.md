# Shared Components Library

This directory contains reusable components used across multiple pages and features. These are generic, composable components that provide consistent UI patterns.

## 📚 Available Components

### `StatusBadge`
Display status values with visual variants (default, destructive, outline, secondary).

**Props:**
```typescript
interface StatusBadgeProps extends BadgeProps {
  status: string;
  statusMap?: Record<string, { label: string; variant: BadgeProps["variant"] }>;
}
```

**Default Status Map:**
```typescript
{
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
  expired: { label: "Expired", variant: "destructive" }
}
```

**Example:**
```tsx
import { StatusBadge } from '@/components/shared';

// Using default status map
<StatusBadge status="active" />

// With custom status map
<StatusBadge 
  status="draft"
  statusMap={{
    draft: { label: "Draft", variant: "outline" },
    published: { label: "Published", variant: "default" }
  }}
/>
```

---

### `DataTable`
Generic configurable table for displaying tabular data.

**Props:**
```typescript
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    render?: (value: any, row: T) => ReactNode;
    className?: string;
  }>;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}
```

**Example:**
```tsx
import { DataTable } from '@/components/shared';

<DataTable
  data={users}
  isLoading={loading}
  columns={[
    { 
      key: 'name', 
      header: 'Name' 
    },
    { 
      key: 'email', 
      header: 'Email' 
    },
    {
      key: 'status',
      header: 'Status',
      render: (status) => <StatusBadge status={status} />
    },
    {
      key: 'id',
      header: 'Actions',
      render: (id) => (
        <Button size="sm" onClick={() => handleEdit(id)}>
          Edit
        </Button>
      )
    }
  ]}
  emptyMessage="No users found"
/>
```

---

### `ResponsiveGrid`
Auto-responsive grid layout with flexible column counts per breakpoint.

**Props:**
```typescript
interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;   // default: 1
    tablet?: number;   // default: 2
    desktop?: number;  // default: 3
  };
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
}
```

**Example:**
```tsx
import { ResponsiveGrid } from '@/components/shared';

<ResponsiveGrid 
  columns={{ mobile: 1, tablet: 2, desktop: 4 }}
  gap="lg"
>
  {companies.map(company => (
    <CompanyCard key={company.id} company={company} />
  ))}
</ResponsiveGrid>
```

---

### `ModalDialog`
Reusable modal/dialog wrapper with consistent styling.

**Props:**
```typescript
interface ModalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  isDismissible?: boolean;
}
```

**Example:**
```tsx
import { ModalDialog } from '@/components/shared';
import { Button } from '@/components/ui/button';

function UserEditDialog({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <ModalDialog
      isOpen={open}
      onOpenChange={setOpen}
      title="Edit User"
      description="Update user information"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSave()}>
            Save
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <input defaultValue={user.name} />
        <input defaultValue={user.email} />
      </form>
    </ModalDialog>
  );
}
```

---

### `AsyncBoundary`
Handles loading, error, and empty states automatically.

**Props:**
```typescript
interface AsyncBoundaryProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
}
```

**Example:**
```tsx
import { AsyncBoundary } from '@/components/shared';

<AsyncBoundary 
  isLoading={isLoading}
  error={error}
  isEmpty={!data?.length}
  emptyMessage="No companies found"
>
  <CompanyGrid companies={data} />
</AsyncBoundary>
```

**States Handled:**
- **Loading:** Shows spinner
- **Error:** Shows error message
- **Empty:** Shows empty message
- **Success:** Shows children

---

## 🎯 When to Use Each Component

| Component | Use When | Example |
|-----------|----------|---------|
| `StatusBadge` | Showing status with colors | User/subscription status |
| `DataTable` | Displaying tabular data | Admin users, companies list |
| `ResponsiveGrid` | Need responsive grid layout | Product cards, company cards |
| `ModalDialog` | Need modal/dialog | Edit, create, confirm actions |
| `AsyncBoundary` | Handling async states | Wrapping async data displays |

---

## 💡 Design Philosophy

### ✅ These components are:
- **Generic** - Work with any data
- **Composable** - Combine with other components
- **Accessible** - Built on Radix UI primitives
- **Styled** - Use Tailwind for consistency
- **Customizable** - Accept className and custom renderers

### ❌ These components are NOT:
- **Domain-specific** - Not for one feature only
- **Feature-heavy** - Keep them simple
- **Opinionated** - Let consumers customize
- **Monolithic** - Break into smaller pieces

---

## 🚀 Common Patterns

### Pattern 1: Table with Custom Columns
```tsx
<DataTable
  data={items}
  columns={[
    { key: 'id', header: 'ID', className: 'w-20' },
    { 
      key: 'name', 
      header: 'Name',
      render: (name) => <strong>{name}</strong>
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <Button size="sm" onClick={() => handleAction(row.id)}>
          Action
        </Button>
      )
    }
  ]}
/>
```

### Pattern 2: Loading States with AsyncBoundary
```tsx
<AsyncBoundary 
  isLoading={loading}
  error={error}
  isEmpty={!data?.length}
>
  <DataTable data={data} columns={columns} />
</AsyncBoundary>
```

### Pattern 3: Responsive Grid of Cards
```tsx
<ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
  {items.map(item => (
    <Card key={item.id}>
      <CardHeader>{item.title}</CardHeader>
      <CardContent>{item.description}</CardContent>
    </Card>
  ))}
</ResponsiveGrid>
```

### Pattern 4: Modal with Form
```tsx
<ModalDialog
  isOpen={open}
  onOpenChange={setOpen}
  title="Create Item"
  footer={
    <Button onClick={() => handleCreate()}>Create</Button>
  }
>
  <form>
    <input placeholder="Title" />
    <input placeholder="Description" />
  </form>
</ModalDialog>
```

---

## 🧪 Component Testing

All components should be tested:

```typescript
import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';

describe('DataTable', () => {
  it('renders data correctly', () => {
    const data = [{ id: 1, name: 'Test' }];
    const columns = [{ key: 'name', header: 'Name' }];
    
    render(<DataTable data={data} columns={columns} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(
      <DataTable 
        data={[]} 
        columns={[]} 
        emptyMessage="No data"
      />
    );
    
    expect(screen.getByText('No data')).toBeInTheDocument();
  });
});
```

---

## 📦 Tree Structure

```
components/shared/
├── index.ts                    (Main exports)
├── StatusBadge.tsx             (Status display)
├── DataTable.tsx               (Table component)
├── ResponsiveGrid.tsx          (Grid layout)
├── ModalDialog.tsx             (Modal wrapper)
├── AsyncBoundary.tsx           (State handler)
├── README.md                   (This file)
└── __tests__/                  (Tests - optional but recommended)
    ├── DataTable.test.tsx
    ├── StatusBadge.test.tsx
    └── ...
```

---

## 🔄 Extending Components

To customize a component, you have three options:

### Option 1: Use Props
```tsx
<DataTable 
  data={data}
  columns={columns}
  className="custom-class"
/>
```

### Option 2: Custom Render Function
```tsx
<DataTable
  data={data}
  columns={[
    {
      key: 'status',
      header: 'Status',
      render: (status, row) => (
        <CustomStatusDisplay status={status} row={row} />
      )
    }
  ]}
/>
```

### Option 3: Extend Component (Advanced)
```tsx
export const CustomDataTable = (props) => (
  <DataTable {...props} className="custom-styling" />
);
```

---

## 🎨 Styling

Components use Tailwind CSS and are styled through:
1. **Built-in styles** - Default styling
2. **Prop-based customization** - `className` prop
3. **Custom renders** - `render` prop for columns

Example with custom styles:
```tsx
<DataTable
  data={data}
  columns={columns}
  className="border rounded-lg"
/>
```

---

## 📚 Resources

- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Component Design](https://react.dev/learn/thinking-in-react)

---

**Need help?** See `MIGRATION_GUIDE.md` for usage examples.
