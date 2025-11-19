import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseURL';

// Define the shape of the data for type safety
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  subscription?: {
    adsUsed: number;
    isActive: boolean;
    plan?: string;
    option?: string;
    startDate?: string;
    endDate?: string;
  };
  profileImg?: string;
  active: boolean;
  lastLogin?: string;
}

export interface UserStats {
  totalUsers: number;
  adminsCount: number;
  regularUsersCount: number;
  activeThisWeek: number;
  adminPercentage: string;
  regularUserPercentage: string;
  activePercentage: string;
}

export interface PaginatedUsersResponse {
  status: string;
  results: number;
  data: {
    data: {
      users: User[];
    };
  };
}

// Define the parameters for the fetch query
export interface GetUsersParams {
  page: number;
  limit: number;
}

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
    }),

    // Get Paginated Users
    getUsers: builder.query<PaginatedUsersResponse, GetUsersParams>({
      query: ({ page, limit }: GetUsersParams) => ({
        url: '/users',
        method: 'GET',
        params: { page, limit },
        withToken: true,
      }),
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
