import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { analyticsApi } from '@/features/analyticsApi';
import { companiesApi } from '@/features/companiesApi';
import { usersApi } from '@/features/usersApi';
import { categoriesApi } from '@/features/categoriesApi';
import { couponsApi } from '@/features/couponsApi';
import { profileApi } from '@/features/profileApi';
import { plansApi } from '@/features/plansApi';
import { notificationsApi } from '@/features/notificationsApi';

export const store = configureStore({
  reducer: {
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
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
      .concat(notificationsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;