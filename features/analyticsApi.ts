import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';

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

// Define the user analytics data interface based on your API response
export interface UserAnalytics {
  totalAds: number;
  pendingAds: number;
  approvedAds: number;
  rejectedAds: number;
  totalViews: number;
  activeAdsList: ActiveAd[];
  chartData: {
    labels: string[];
    data: number[];
  };
}

export interface ActiveAd {
  _id: string;
  companyName: string;
  companyNameEn: string;
  description: string;
  descriptionEn: string;
  logo: string;
  country: string;
  city: string;
  email: string;
  whatsapp: string;
  facebook: string;
  website: string;
  status: string;
  adType: string;
  ratingsQuantity: number;
  userId: string;
  categoryId: {
    nameAr: string;
    nameEn: string;
    color: string;
    id: string | null;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  isApproved: boolean;
  logoUrl: string;
  id: string;
}

// Define the API response wrapper interfaces
export interface AnalyticsApiResponse {
  status: string;
  message: string;
  data: AnalyticsData;
}

export interface UserAnalyticsApiResponse {
  status: string;
  message: string;
  data: {
    data: UserAnalytics;
  };
}

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Analytics', 'User'], 
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
    // Get user analytics
    getUserAnalytics: builder.query<UserAnalytics, void>({
      query: () => ({
        url: '/users/my-analytics',
        method: 'GET',
        withToken: true,
      }),
      // Transform the response to extract the nested data
      transformResponse: (response: UserAnalyticsApiResponse) => response.data.data,
      providesTags: ['User'], // Provides the 'User' tag
    }),
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetAnalyticsQuery,
  useGetUserAnalyticsQuery
} = analyticsApi;