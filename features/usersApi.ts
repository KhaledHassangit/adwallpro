import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { GetUsersParams, PaginatedUsersResponse, UserStats } from '@/types/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User'], // Tag for cache invalidation
  endpoints: (builder) => ({
    // Get User Statistics
    getUserStats: builder.query<UserStats, void>({
      query: () => ({
        url: '/users/stats',
        method: 'GET',
        withToken: true,
      }),
      // Transform the response to match the expected structure
      transformResponse: (response: any) => {
        // The API returns { status, message, data: { data: { stats } } }
        // We want to flatten this to { data: { stats } }
        return {
          data: {
            data: response.data.data
          }
        };
      },
    }),

    // Get Paginated Users
    getUsers: builder.query<PaginatedUsersResponse, GetUsersParams>({
      query: ({ page, limit }: GetUsersParams) => ({
        url: '/users',
        method: 'GET',
        params: { page, limit },
        withToken: true,
      }),
      // Transform the response to match the expected structure
      transformResponse: (response: any) => {
        // The API returns { status, message, data: { results, paginationResult, data: { users } } }
        // We want to flatten this to { data: { results, paginationResult, data: { users } } }
        return {
          data: {
            results: response.data.results,
            paginationResult: response.data.paginationResult,
            data: {
              users: response.data.data.users
            }
          }
        };
      },
      providesTags: ['User'], // Provides the 'User' tag
    }),

    // Create a new Admin
    createAdmin: builder.mutation<void, {
      name: string;
      email: string;
      password: string;
      passwordConfirm: string;
      phone?: string;
    }>({
      query: (adminData) => ({
        url: '/users/admins',
        method: 'POST',
        data: adminData,
        withToken: true,
      }),
      invalidatesTags: ['User'], // Invalidate the 'User' tag to refetch the list
    }),

    // Delete a User
    deleteUser: builder.mutation<void, string>({
      query: (userId:string) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['User'], // Invalidate the 'User' tag to refetch the list
    }),
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetUserStatsQuery,
  useGetUsersQuery,
  useCreateAdminMutation,
  useDeleteUserMutation,
} = usersApi;