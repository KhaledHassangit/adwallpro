// lib/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// Import all your API slices
import { analyticsApi } from '@/api/admin/analyticsApi';
import { companiesApi } from '@/api/admin/companiesApi';
import { usersApi } from '@/api/admin/usersApi';
import { categoriesApi } from '@/api/admin/categoriesApi';
import { couponsApi } from '@/api/admin/couponsApi';
import { profileApi } from '@/api/admin/profileApi';
import { plansApi } from '@/api/admin/plansApi'; // <-- Import the new plansApi
import { userApiDashboard } from '@/api/user/userApi';

export const store = configureStore({
  reducer: {
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer, // <-- Add the new reducer
    [userApiDashboard.reducerPath]: userApiDashboard.reducer, // <-- Add the new reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(analyticsApi.middleware)
      .concat(companiesApi.middleware)
      .concat(usersApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(couponsApi.middleware)
      .concat(profileApi.middleware)
      .concat(plansApi.middleware)
      .concat(userApiDashboard.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;