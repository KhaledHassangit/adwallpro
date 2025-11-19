// lib/api/plansApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseURL';

// Define the shape of the data for type safety
export interface PlanOption {
  duration: string;
  priceUSD: number;
  discountPercent?: number;
  finalPriceUSD: number;
  adsCount: number;
  categories?: string[];
  _id?: string;
}

export interface Plan {
  _id?: string;
  name: string;
  code: string;
  color?: string;
  description?: string;
  planType: 'Basic' | 'Standard' | 'Premium' | 'Monthly';
  options: PlanOption[];
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlansResponse {
  status: string;
  message: string;
  data: {
    results: number;
    paginationResult: {
      currentPage: number;
      limit: number;
      numberOfPages: number;
    };
    data: Plan[];
  };
}

export interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  color: string;
  slug: string;
  image?: any;
}

export interface CategoriesResponse {
  status: string;
  message: string;
  data: {
    results: number;
    paginationResult: {
      currentPage: number;
      limit: number;
      numberOfPages: number;
    };
    data: Category[];
  };
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

export const plansApi = createApi({
  reducerPath: 'plansApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Plan'], // Tag for cache invalidation
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

    // Get all categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
        withToken: true,
      }),
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
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetPlansQuery,
  useGetCategoriesQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;