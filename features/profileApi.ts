// lib/api/profileApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { PasswordChangeRequest, UpdateProfileRequest, UserProfile } from '@/types/types';

// Define the shape of the data for type safety

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Profile'], // Tag for cache invalidation
  endpoints: (builder) => ({
    // Update user profile
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/updateMe',
        method: 'PUT',
        data,
        withToken: true,
      }),
      invalidatesTags: ['Profile'], // Invalidate the 'Profile' tag to refetch
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
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;