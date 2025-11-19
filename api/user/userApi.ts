// lib/api/userApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseURL';

// Define the shape of the data for type safety
export interface Company {
  _id: string;
  companyName: string;
  description: string;
  categoryId: {
    _id: string;
    nameAr: string;
    nameEn: string;
  };
  isApproved: boolean;
  createdAt: string;
  image?: string;
  email?: string;
  __v?: number;
}

export interface UserAnalytics {
  totalAds: number;
  pendingAds: number;
  approvedAds: number;
  rejectedAds: number;
  totalViews: number;
  activeAdsList: any[];
  chartData: {
    labels: string[];
    data: number[];
  };
}

export interface PlanOption {
  duration: string;
  priceUSD: number;
  discountPercent?: number;
  finalPriceUSD?: number;
  adsCount: number;
  categories: string[];
  _id: string;
}

export interface Subscription {
  _id: string;
  plan: {
    _id: string;
    name: string;
    code: string;
    color?: string;
    description?: string;
    planType?: string;
    options?: PlanOption[];
    features?: string[];
    isActive?: boolean;
  };
  status: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface ValidationError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export interface ApiError {
  errors: ValidationError[];
}

export const userApiDashboard = createApi({
  reducerPath: 'userApiDashboard',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User', 'Subscription'], // Tags for cache invalidation
  endpoints: (builder) => ({
    // Get user analytics
    getUserAnalytics: builder.query<UserAnalytics, void>({
      query: () => ({
        url: '/users/my-analytics',
        method: 'GET',
        withToken: true,
      }),
      providesTags: ['User'], // Provides the 'User' tag
    }),

    // Get user subscriptions
    getUserSubscriptions: builder.query<Subscription[], void>({
      query: () => ({
        url: '/subscriptions/my-subscriptions',
        method: 'GET',
        withToken: true,
      }),
      providesTags: ['Subscription'], // Provides the 'Subscription' tag
    }),

    // Update user profile
    updateProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (data) => ({
        url: '/users/updateMe',
        method: 'PUT',
        data,
        withToken: true,
      }),
      invalidatesTags: ['User'], // Invalidate the 'User' tag to refetch
    }),

    // Change password
    changePassword: builder.mutation<void, PasswordChangeRequest>({
      query: (data) => ({
        url: '/users/changeMyPassword',
        method: 'PUT',
        data,
        withToken: true,
      }),
    }),
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetUserAnalyticsQuery,
  useGetUserSubscriptionsQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApiDashboard;