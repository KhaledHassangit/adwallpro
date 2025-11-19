// lib/api/profileApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseURL';

// Define the shape of the data for type safety
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  // Add other user profile fields as needed
}

export interface PasswordChangeRequest {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface UpdateProfileRequest {
  name: string;
  phone?: string;
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