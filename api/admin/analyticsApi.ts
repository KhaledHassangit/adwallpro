import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseURL';

// Define the shape of the analytics data for type safety
export interface AnalyticsData {
  userCount: number;
  adminCount: number;
  companies: {
    active: number;
    pending: number;
  };
  categoryCount: number;
  latestActivities: any[];
  charts?: {
    subscriptionsPerPlan?: {
      labels: string[];
      datasets: any[];
    };
  };
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Analytics'], // Optional: for cache invalidation
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
  }),
});

// Export the auto-generated hook for use in components
export const { useGetAnalyticsQuery } = analyticsApi;