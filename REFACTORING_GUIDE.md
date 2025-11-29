# AdWallPro Refactoring Guide

## Overview
This document outlines the comprehensive refactoring of the AdWallPro codebase to implement:
- Clean Architecture (separation of concerns)
- Reusable Components
- Custom Hooks Pattern
- SSR-compatible i18n with `/en` and `/ar` routes
- Proper font implementation (Almrai for Arabic, Poppins for English)
- Dependency cleanup

---

## 1. ISSUES FOUND

### 1.1 Font Implementation Issues
**Current Problem:** Fonts are applied globally but don't properly switch based on language.
- Both fonts loaded for all languages
- CSS selectors `:lang()` not properly cascading
- No proper SSR support for language-specific fonts

**Solution:** Implement language-aware font loading in layout + dynamic className injection

### 1.2 Translation System Issues
**Current Problem:** Client-side only, no SSR support
- Uses localStorage (browser-only)
- No URL-based language detection (`/en`, `/ar`)
- Cannot pre-render static content in different languages
- SEO issues with language meta tags

**Solution:** Migrate to next-i18n-router with middleware

### 1.3 Component Organization Issues

#### Unused/Single-Use Components to Review:
1. `components/util/link.tsx` - Uses native Next Link, custom prefetching unnecessary
2. `components/ads/modern-ad-card.tsx` - Check imports across pages
3. `components/home/chatbot.tsx` - Check if actually used
4. `components/home/slider.tsx` - Check if actually used

#### Components to Make Reusable:
1. `admin-tables.tsx` - Can be generic table with data configuration
2. Admin dialogs - Pattern for reusable modal/dialog system
3. Form components - Extract common patterns

### 1.4 Logic Not Separated from UI
**Current Examples:**
- `subscriptions/page.tsx` - Mixed data fetching, calculations, and rendering
- Company category page - Complex filtering logic in component
- Multiple pages have inline API calls and state management

**Solution:** Extract to custom hooks (`useSubscriptions`, `useCompanyFilter`, etc.)

### 1.5 Unused Packages (Candidates)
- `google-auth-library` - Check if @react-oauth/google handles it
- `swiper` + `embla-carousel-react` - Using both carousel libs?
- `immer` - Check if redux-toolkit's built-in handles it
- `use-sync-external-store` - Verify if needed with current state management

---

## 2. IMPLEMENTATION PLAN

### Phase 1: Font System & i18n Foundation
- [ ] Create locale-aware layout system
- [ ] Setup SSR middleware for language routing
- [ ] Implement proper font CSS fallbacks
- [ ] Update LanguageProvider to work with middleware

### Phase 2: Custom Hooks (Separation of Logic)
- [ ] Create `hooks/` structure
  - `useSubscriptions.ts` - Subscription data + calculations
  - `useCompanyFilter.ts` - Company filtering logic
  - `useAuthProtection.ts` - Auth redirect logic
  - `useAsyncDataLoader.ts` - Generic data loading pattern
  - `useDateFormatting.ts` - Date utility functions
  - `usePagination.ts` - Pagination logic

### Phase 3: Reusable Components
- [ ] Create `components/shared/` directory for truly reusable
  - `DataTable.tsx` - Generic table for admin panels
  - `ModalDialog.tsx` - Generic modal wrapper
  - `FormField.tsx` - Enhanced form field
  - `CardGrid.tsx` - Responsive grid component
  - `StatusBadge.tsx` - Status display logic

### Phase 4: Code Cleanup
- [ ] Remove/audit unused components
- [ ] Remove unused imports
- [ ] Consolidate carousel libraries
- [ ] Clean up package.json

### Phase 5: Architecture Documentation
- [ ] Update component API docs
- [ ] Create hooks usage guide
- [ ] Document i18n routing

---

## 3. QUICK WIN RECOMMENDATIONS

1. **Immediate Fixes (Next 30 minutes):**
   - Fix font CSS selectors in `globals.css`
   - Create middleware for language routing
   - Extract date utilities to custom hook

2. **High Impact (Next 2 hours):**
   - Create 3-4 key custom hooks
   - Convert admin-tables to generic component
   - Setup middleware-based i18n

3. **Polish (Next 4 hours):**
   - Document all hooks
   - Create component library structure
   - Clean package.json

---

## 4. FILES TO MODIFY

### Critical
- `app/layout.tsx` - Font loading logic
- `middleware.ts` (create new) - Language routing
- `i18n/` - Add server-side support
- `providers/LanguageProvider.tsx` - Update for SSR
- `app/globals.css` - Fix font selectors

### Important
- Component files - Extract display logic
- Page files - Remove business logic
- Create `hooks/` directory
- Create `components/shared/` directory

### Optional Cleanup
- `package.json` - Remove unused packages
- Consolidate carousel libraries
- Audit localStorage usage

---

## 5. NEXT STEPS

1. Start with **Phase 1** - Fix fonts and i18n routing
2. Create **Phase 2** hooks as you encounter complex logic
3. Gradually refactor components in **Phase 3**
4. Document everything in **Phase 5**

