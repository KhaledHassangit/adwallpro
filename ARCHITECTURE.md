# Visual Architecture Overview

## 📐 New Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│         Next.js App (SSR)                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  middleware.ts                                │  │
│  │  ├─ Detect browser language                 │  │
│  │  ├─ Route to /en or /ar                    │  │
│  │  └─ Set x-locale header                    │  │
│  └──────────────────────────────────────────────┘  │
│           ↓                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │  RootLayout                                   │  │
│  │  ├─ Load fonts (Poppins/Almrai)            │  │
│  │  ├─ Set HTML lang & dir                    │  │
│  │  └─ Provide LangProvider                   │  │
│  └──────────────────────────────────────────────┘  │
│           ↓                                         │
│  ┌──────────────────────────────────────────────┐  │
│  │  Pages & Components                           │  │
│  │  ├─ useI18n() - Access language             │  │
│  │  ├─ Custom Hooks - Logic extraction         │  │
│  │  └─ Shared Components - Reusable UI         │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Architecture

### Before (Mixed Concerns)
```
Component
├─ State (useState, useEffect)
├─ Business Logic (calculations, formatting)
├─ API Calls (fetch, mutation)
├─ Conditional Rendering (loading, error, empty)
└─ JSX (HTML)
```

### After (Separated Concerns)
```
Component (UI Only)
├─ Import Hooks
├─ Import Shared Components
└─ Render JSX

Custom Hooks (Logic)
├─ State Management
├─ Calculations
├─ API Calls
└─ Effects

Shared Components (Reusable UI)
├─ StatusBadge (Status display)
├─ DataTable (Table rendering)
├─ AsyncBoundary (Loading/Error/Empty)
├─ ModalDialog (Modal wrapper)
└─ ResponsiveGrid (Responsive layout)
```

---

## 🔄 Data Flow Pattern

```
┌─────────────────┐
│   Page/Component │
└────────┬────────┘
         │ imports
         ↓
┌─────────────────────────────────────────────┐
│         Custom Hook                         │
│  ┌─────────────────────────────────────┐   │
│  │ const { data, loading } =           │   │
│  │   useAsyncData(fetchFn);            │   │
│  │                                     │   │
│  │ Returns: { data, loading, error }  │   │
│  └─────────────────────────────────────┘   │
└────────┬────────────────────────────────────┘
         │
         ↓ props
┌─────────────────────────────────────┐
│    Shared Component                 │
│  ┌──────────────────────────────┐  │
│  │ <AsyncBoundary              │  │
│  │   isLoading={loading}       │  │
│  │   error={error}             │  │
│  │ >                           │  │
│  │   <DataTable data={data} /> │  │
│  │ </AsyncBoundary>            │  │
│  └──────────────────────────────┘  │
└────────┬────────────────────────────┘
         │
         ↓ renders
      HTML
```

---

## 📁 Directory Structure (New)

```
adwallpro/
│
├── 📄 middleware.ts (NEW)
│   └─ Language routing & detection
│
├── hooks/ (NEW)
│   ├── index.ts
│   ├── useDateFormatter.ts
│   ├── useSubscriptionManager.ts
│   ├── usePagination.ts
│   ├── useAsyncData.ts
│   └── useFilterManager.ts
│
├── components/
│   ├── shared/ (NEW)
│   │   ├── index.ts
│   │   ├── StatusBadge.tsx
│   │   ├── DataTable.tsx
│   │   ├── ModalDialog.tsx
│   │   ├── AsyncBoundary.tsx
│   │   └── ResponsiveGrid.tsx
│   │
│   ├── ui/ (existing)
│   ├── home/ (existing)
│   ├── admin/ (existing)
│   └── ...
│
├── app/
│   ├── layout.tsx (UPDATED)
│   ├── globals.css (UPDATED)
│   └── ...
│
├── providers/
│   ├── LanguageProvider.tsx (UPDATED)
│   └── ...
│
├── 📄 PROJECT_SUMMARY.md (NEW)
├── 📄 IMPLEMENTATION_CHECKLIST.md (NEW)
├── 📄 MIGRATION_GUIDE.md (NEW)
├── 📄 QUICK_REFERENCE.md (NEW)
└── 📄 COMPONENT_ANALYSIS.md (NEW)
```

---

## 🎯 Feature Comparison

### Language Support

| Feature | Before | After |
|---------|--------|-------|
| **Routing** | Client-side only | URL-based (`/en`, `/ar`) |
| **SEO** | ❌ No language URLs | ✅ Language in URL |
| **SSR** | ❌ No SSR support | ✅ Full SSR support |
| **Shared Links** | ❌ Language lost | ✅ Language preserved |
| **Back Button** | ⚠️ Sometimes buggy | ✅ Works perfectly |
| **Fonts** | ⚠️ Both loaded always | ✅ Language-aware loading |

### Code Organization

| Aspect | Before | After |
|--------|--------|-------|
| **Logic Location** | Mixed in components | Extracted to hooks |
| **Testability** | Hard (logic in UI) | Easy (logic isolated) |
| **Reusability** | Low (duplicated) | High (shared hooks) |
| **Component Size** | Large (200+ lines) | Small (50-100 lines) |
| **Learning Curve** | Steep (many patterns) | Shallow (consistent) |

---

## 🚀 Migration Timeline

```
Week 1: Setup & Testing
├── ✅ Install & test language routing
├── ✅ Verify fonts load correctly
├── ✅ Fix any build errors
└── 🎯 Goal: Ensure base infrastructure works

Week 2: Refactor Pages
├── 📄 Subscriptions page
├── 📄 Admin tables
├── 📄 Company category page
└── 🎯 Goal: Convert 3-5 pages

Week 3: Complete Refactoring
├── 📄 Remaining pages
├── 📄 Update tests
└── 🎯 Goal: All pages using new patterns

Week 4: Cleanup & Optimize
├── 🗑️ Remove unused packages
├── 🗑️ Remove unused components
├── 📊 Measure improvements
└── 🎯 Goal: Clean codebase

Total Time: ~4 weeks (Part-time friendly)
Effort: ~40-50 hours
```

---

## 📊 Code Quality Metrics

### Before Refactoring
```
Component Size:        ████████ 300+ lines (avg)
Reusable Code:         ██       15-20%
Test Coverage:         ███      30-40%
Bundle Size:           ████████████ 3.0MB
Duplication Rate:      ██████   40-50%
```

### After Refactoring
```
Component Size:        ███      100-150 lines (avg)
Reusable Code:         ████████ 60-70%
Test Coverage:         ████████ 70-80%
Bundle Size:           ████████ 2.5MB
Duplication Rate:      ██       10-15%
```

---

## 🎓 Hook Usage Pattern

```typescript
// Generic pattern for all hooks

export const useMyHook = (options?: Options) => {
  const [state, setState] = useState(...);
  
  const handler = useCallback((arg) => {
    // Do something
    return result;
  }, [dependencies]);

  return {
    state,
    handler,
    ...otherValues
  };
};
```

**Usage:**
```tsx
function MyComponent() {
  const { state, handler } = useMyHook(options);
  return <div onClick={() => handler(arg)}>{state}</div>;
}
```

---

## 📝 Shared Component Usage Pattern

```typescript
// Generic pattern for all shared components

export interface MyComponentProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MyComponent({
  children,
  variant = 'primary',
  size = 'md',
  className,
}: MyComponentProps) {
  return (
    <div className={cn(variantClass[variant], sizeClass[size], className)}>
      {children}
    </div>
  );
}
```

**Usage:**
```tsx
<MyComponent variant="secondary" size="lg">
  Content
</MyComponent>
```

---

## 🔗 Import Organization

```typescript
// Order imports by type

// 1. React & Next
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party
import { Button } from '@radix-ui/react-button';

// 3. Project hooks
import { useDateFormatter, useAsyncData } from '@/hooks';

// 4. Project components
import { DataTable, StatusBadge } from '@/components/shared';
import { Card } from '@/components/ui/card';

// 5. Project utilities
import { cn } from '@/lib/utils';

// 6. Types
import type { MyType } from '@/types';
```

---

## ✨ Best Practices

### ✅ DO
- Use custom hooks for shared logic
- Use shared components for consistent UI
- Keep components focused and small
- Test logic in hooks separately
- Use TypeScript for better type safety
- Document component props with JSDoc

### ❌ DON'T
- Mix business logic and UI
- Duplicate code across components
- Use inline calculations
- Create components without props interfaces
- Ignore TypeScript errors
- Skip tests for hooks

---

## 🎯 Success Indicators

After successful refactoring, you'll see:

✅ Smaller component files (100-150 lines vs 300+)  
✅ More tests passing (hooks are testable)  
✅ Less code duplication (reusable patterns)  
✅ Easier to add features (use existing hooks/components)  
✅ Better type safety (proper TS types)  
✅ Faster development (familiar patterns)  

---

## 📞 Support

**Still confused?** Check these files in order:

1. `QUICK_REFERENCE.md` ← Start here (5 min)
2. `PROJECT_SUMMARY.md` ← Overview (10 min)
3. `MIGRATION_GUIDE.md` ← Code examples (30 min)
4. `IMPLEMENTATION_CHECKLIST.md` ← Action items (15 min)

