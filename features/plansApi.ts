import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { CategoriesResponse, Plan, PlansResponse } from '@/types/types';
import { Subscription } from 'react-redux';


export const plansApi = createApi({
  reducerPath: 'plansApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Plan', 'Subscription'], // Tags for cache invalidation
  endpoints: (builder) => ({
    // Get all plans
    getPlans: builder.query<PlansResponse, void>({
      query: () => ({
        url: '/plans',
        method: 'GET',
        withToken: true,
      }),
      providesTags: ['Plan'], // Provides the 'Plan' tag
    }),


    // Create a new plan
    createPlan: builder.mutation<Plan, Partial<Plan>>({
      query: (data) => ({
        url: '/plans',
        method: 'POST',
        data,
        withToken: true,
      }),
      invalidatesTags: ['Plan'], // Invalidate the 'Plan' tag to refetch
    }),

    // Update a plan
    updatePlan: builder.mutation<Plan, { id: string; data: Partial<Plan> }>({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: 'PUT',
        data,
        withToken: true,
      }),
      invalidatesTags: ['Plan'], // Invalidate the 'Plan' tag to refetch
    }),

    // Delete a plan
    deletePlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Plan'], // Invalidate the 'Plan' tag to refetch
    }),
    
    // Get user subscriptions (moved from userApi.ts)
    // Get user subscriptions (moved from userApi.ts)
getUserSubscriptions: builder.query<Subscription[], void>({
  query: () => ({
    url: '/subscriptions/my-subscriptions',
    method: 'GET',
    withToken: true,
  }),
  // Transform the response to extract the data array
  transformResponse: (response: { status: string; data: { data: Subscription[] } }) => {
    return response.data.data;
  },
  providesTags: ['Subscription'], // Provides the 'Subscription' tag
}),
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetUserSubscriptionsQuery,
} = plansApi;