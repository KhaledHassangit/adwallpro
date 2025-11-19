import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { AnalyticsData, UserAnalytics } from '@/types/types';


export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Analytics', 'User'], // Tags for cache invalidation
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsData, void>({
      query: () => ({ 
        url: '/analytics', 
        method: 'GET',
        withToken: true // This is an admin-only route, so it needs the token
      }),
      // Optional: Transform the response if the API structure is nested
      transformResponse: (response: { data: { data: AnalyticsData } }) => response.data.data,
    }),
    
    // Get user analytics (moved from userApi.ts)
    getUserAnalytics: builder.query<UserAnalytics, void>({
      query: () => ({
        url: '/users/my-analytics',
        method: 'GET',
        withToken: true,
      }),
      providesTags: ['User'], // Provides the 'User' tag
    }),
  }),
});

// Export the auto-generated hooks for use in components
export const { 
  useGetAnalyticsQuery,
  useGetUserAnalyticsQuery 
} = analyticsApi;