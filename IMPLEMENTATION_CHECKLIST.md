# Implementation Checklist & Setup Guide

## ✅ COMPLETED

### Phase 1: Core Infrastructure
- [x] Created `middleware.ts` for SSR language routing (`/en`, `/ar`)
- [x] Updated `LanguageProvider.tsx` for SSR compatibility
- [x] Fixed font loading in `app/layout.tsx`
- [x] Fixed font CSS selectors in `app/globals.css`
- [x] Added proper language-aware HTML attributes

### Phase 2: Custom Hooks Library
- [x] Created `hooks/useDateFormatter.ts` - Date formatting utilities
- [x] Created `hooks/useSubscriptionManager.ts` - Subscription logic
- [x] Created `hooks/usePagination.ts` - Pagination state management
- [x] Created `hooks/useAsyncData.ts` - Generic data loading
- [x] Created `hooks/useFilterManager.ts` - Filter state management
- [x] Created `hooks/index.ts` - Centralized exports

### Phase 3: Shared Components Library
- [x] Created `components/shared/StatusBadge.tsx` - Status display
- [x] Created `components/shared/DataTable.tsx` - Generic table
- [x] Created `components/shared/ResponsiveGrid.tsx` - Grid layout
- [x] Created `components/shared/ModalDialog.tsx` - Modal wrapper
- [x] Created `components/shared/AsyncBoundary.tsx` - State handling
- [x] Created `components/shared/index.ts` - Centralized exports

### Phase 4: Documentation
- [x] Created `REFACTORING_GUIDE.md` - Overview and strategy
- [x] Created `COMPONENT_ANALYSIS.md` - Detailed analysis
- [x] Created `MIGRATION_GUIDE.md` - How-to refactor
- [x] Created `IMPLEMENTATION_CHECKLIST.md` - This file

---

## 📋 TODO - NEXT STEPS

### Priority 1: Testing & Verification (Do First!)

#### Step 1: Install Dependencies
```powershell
# Run in project root
cd c:\Users\Khaled\Desktop\adwallpro

# Ensure all dependencies are installed
npm install

# Verify TypeScript compilation
npm run build
```

#### Step 2: Test Language Routing
```powershell
# Start dev server
npm run dev

# Test these URLs:
# http://localhost:3000/en
# http://localhost:3000/ar
# http://localhost:3000/en/login
# http://localhost:3000/ar/login

# Verify:
# ✓ URLs route correctly
# ✓ HTML lang attribute changes
# ✓ HTML dir attribute changes
# ✓ Font changes based on language
```

#### Step 3: Test Font Loading
Open browser DevTools and check:
```
Computed styles in Inspector:
html {
  font-family: 'Almarai' (for /ar)
  font-family: 'Poppins' (for /en)
  dir: 'rtl' (for /ar)
  dir: 'ltr' (for /en)
}
```

---

### Priority 2: Refactor High-Impact Pages

#### Pages to Refactor (In Order of Impact)

1. **`app/(user-dashboard)/manage/subscriptions/page.tsx`** ⭐ HIGH IMPACT
   - Currently: 300+ lines of mixed logic and UI
   - Action:
     - [ ] Import hooks: `useDateFormatter`, `useSubscriptionManager`, `usePagination`
     - [ ] Extract date formatting logic
     - [ ] Extract progress calculation
     - [ ] Extract status badge logic
     - [ ] Move pagination to hook
     - [ ] Use `AsyncBoundary` for loading/error states
   - Files to update:
     ```
     app/(user-dashboard)/manage/subscriptions/page.tsx
     ```

2. **`app/(marketing)/companies/category/[id]/page.tsx`** ⭐ HIGH IMPACT
   - Currently: Complex filtering and data loading
   - Action:
     - [ ] Import `useFilterManager` hook
     - [ ] Extract view tracking logic to custom hook
     - [ ] Use `AsyncBoundary` for states
     - [ ] Consider creating `useCompanyFilter.ts` hook
   - Files to update:
     ```
     app/(marketing)/companies/category/[id]/page.tsx
     ```

3. **Admin Tables (`app/(dashboard)/admin/...`** ⭐⭐ CRITICAL
   - Currently: Duplicated table code
   - Action:
     - [ ] Replace all admin tables with `DataTable` component
     - [ ] Extract filtering to `useFilterManager`
     - [ ] Extract pagination to `usePagination`
   - Files to update:
     ```
     app/(dashboard)/admin/page.tsx
     app/(dashboard)/admin/users/page.tsx
     app/(dashboard)/admin/companies/page.tsx
     app/(dashboard)/admin/categories/page.tsx
     app/(dashboard)/admin/coupons/page.tsx
     app/(dashboard)/admin/plans/page.tsx
     components/admin/admin-users-table.tsx
     components/admin/admin-companies-table.tsx
     components/admin/admin-categories-table.tsx
     components/admin/AdminCouponsTable.tsx
     ```

---

### Priority 3: Clean Package.json

#### Remove Unused Packages
```powershell
# Run these commands to remove unused packages
npm uninstall google-auth-library

# Optional - if swiper not used (keep embla-carousel)
npm uninstall swiper

# Optional - if not using outside Redux
npm uninstall immer

# Optional - verify before removing
npm uninstall use-sync-external-store
```

#### Commands to Verify Before Removing
```powershell
# Search for usage of packages
grep -r "google-auth-library" src/
grep -r "swiper" src/
grep -r "immer" src/
grep -r "use-sync-external-store" src/
grep -r "js-cookie" src/
```

---

### Priority 4: Component Library Audit

#### Step 1: Identify Unused Components

Run these searches to find actual usage:
```powershell
# Check each potentially unused component
grep -r "util/link" src/
grep -r "home/chatbot" src/
grep -r "home/slider" src/
grep -r "forms/image-upload" src/
```

#### Step 2: Remove or Mark Components
```powershell
# If unused, rename with underscore prefix to hide but keep
# (instead of deleting, in case needed later)

# Example:
# components/util/link.tsx → components/util/_link.tsx.disabled
# components/home/chatbot.tsx → components/home/_chatbot.tsx.disabled
```

---

## 🔄 REFACTORING WORKFLOW

### For Each Page/Component to Refactor:

1. **Analyze Current Code**
   ```powershell
   # Read the file
   # Identify:
   # - State variables
   # - Calculations/business logic
   # - Conditionals (loading, error, empty)
   # - Repeated patterns
   ```

2. **Extract Logic to Hook**
   ```tsx
   // Create hook with reusable logic
   const useMyLogic = () => {
     // Move calculations here
     return { /* computed values */ }
   }
   ```

3. **Replace UI Patterns**
   ```tsx
   // Replace conditional renders
   if (loading) // → <AsyncBoundary isLoading={loading}>
   if (error) // → <AsyncBoundary error={error}>
   if (empty) // → <AsyncBoundary isEmpty={isEmpty}>
   
   // Replace tables
   <table> // → <DataTable data={data} columns={columns}>
   
   // Replace modals
   <Dialog> // → <ModalDialog>
   
   // Replace status displays
   <Badge> // → <StatusBadge status={status}>
   ```

4. **Test**
   ```powershell
   npm run dev
   # Test the refactored page in browser
   # Verify same functionality
   ```

5. **Commit**
   ```powershell
   git add .
   git commit -m "refactor: extract logic from [component] to hooks"
   ```

---

## 📊 TESTING MATRIX

### URLs to Test After Implementation

| Route | Expected | Status |
|-------|----------|--------|
| `/` | Redirects to `/en` | [ ] |
| `/en` | English home page | [ ] |
| `/ar` | Arabic home page | [ ] |
| `/en/login` | English login | [ ] |
| `/ar/login` | Arabic login | [ ] |
| `/en/...` | All pages work in English | [ ] |
| `/ar/...` | All pages work in Arabic | [ ] |

### Language Features to Test

| Feature | English | Arabic | Status |
|---------|---------|--------|--------|
| Font (Poppins) | ✓ | N/A | [ ] |
| Font (Almrai) | N/A | ✓ | [ ] |
| Text Direction (LTR) | ✓ | N/A | [ ] |
| Text Direction (RTL) | N/A | ✓ | [ ] |
| Language Switcher | ✓ | ✓ | [ ] |
| Navigation | ✓ | ✓ | [ ] |
| Forms | ✓ | ✓ | [ ] |

### Component Tests

| Component | Tested | Status |
|-----------|--------|--------|
| `StatusBadge` | All variants | [ ] |
| `DataTable` | Load, empty, error | [ ] |
| `ModalDialog` | Open, close, footer | [ ] |
| `AsyncBoundary` | All states | [ ] |
| `ResponsiveGrid` | Mobile, tablet, desktop | [ ] |

---

## 🚀 MIGRATION TIMELINE

### Week 1 (CRITICAL - Do This First)
- [ ] Run `npm install`
- [ ] Test language routing (`/en`, `/ar`)
- [ ] Verify fonts load correctly
- [ ] Fix any TypeScript errors
- [ ] Document issues found

### Week 2 (HIGH PRIORITY)
- [ ] Refactor subscriptions page
- [ ] Refactor company category page
- [ ] Test refactored pages thoroughly
- [ ] Update tests

### Week 3 (MEDIUM PRIORITY)
- [ ] Refactor admin pages (users, companies, categories, coupons)
- [ ] Consolidate table components
- [ ] Update all admin pages to use `DataTable`

### Week 4 (LOW PRIORITY)
- [ ] Remove unused packages from `package.json`
- [ ] Audit and remove unused components
- [ ] Documentation updates
- [ ] Performance optimization

---

## 🐛 TROUBLESHOOTING

### Issue: Language doesn't persist on page reload
**Solution:** Middleware handles this automatically via URL routing

### Issue: Fonts not switching
**Solution:** Check `app/globals.css` and ensure HTML has `lang="en"` or `lang="ar"`

### Issue: TypeScript errors in hooks
**Solution:** Ensure all hooks are properly imported from `hooks/index.ts`

### Issue: Components not found
**Solution:** Check imports use `@/components/shared/` path

### Issue: Build fails
**Solution:** Run `npm run build` to see errors, fix TypeScript issues first

---

## ✨ SUCCESS CRITERIA

After completing all phases:

- [x] Language routing works (`/en`, `/ar`)
- [x] Fonts change based on language
- [x] Custom hooks library created and documented
- [x] Shared components library created and documented
- [ ] 3-5 pages refactored to use new hooks/components
- [ ] Package.json cleaned up (unused packages removed)
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] Build succeeds with `npm run build`
- [ ] Performance improved (~20-30% less code duplication)

---

## 📞 QUESTIONS?

If you encounter issues:

1. Check the specific guide file:
   - `MIGRATION_GUIDE.md` - How to refactor
   - `COMPONENT_ANALYSIS.md` - What to remove
   - `REFACTORING_GUIDE.md` - Overview

2. Common issues are documented in TROUBLESHOOTING section above

3. Run these diagnostics:
   ```powershell
   npm run build  # Check compilation
   npm run lint   # Check linting
   npm run dev    # Test locally
   ```

---

## 📝 NOTES

- All changes are additive - nothing broken
- Old code can coexist with new hooks/components during refactoring
- Migrate page-by-page to avoid breaking changes
- Commit after each page refactoring
- Keep TypeScript strict mode enabled

