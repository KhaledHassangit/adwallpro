// @/features/companiesApi.js

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { CompaniesResponse, GetCompaniesParams } from '@/types/types';

export const companiesApi = createApi({
  reducerPath: 'companiesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Company'], // Tag for cache invalidation
  endpoints: (builder) => ({
    // Get Companies with filters and pagination
    getCompanies: builder.query<CompaniesResponse, GetCompaniesParams>({
      query: (params) => {
        // Build the appropriate URL based on the parameters
        let url = '/companies';
        
        // If we have a categoryId, use the category-specific endpoint
        if (params.categoryId && params.categoryId !== "all") {
          url = `/companies/category/${params.categoryId}`;
        } else if (params.search) {
          url = '/companies/search';
        } else if (params.country || params.city) {
          url = '/companies/search-location';
        }
        
        return {
          url,
          method: 'GET',
          params: {
            // Include pagination parameters
            page: params.page || 1,
            limit: params.limit || 10,
            // Include filter parameters
            ...(params.search && { search: params.search }),
            ...(params.country && { country: params.country }),
            ...(params.city && { city: params.city }),
          },
          withToken: true,
        };
      },
      providesTags: ['Company'], // Provides 'Company' tag
    }),

    // Get a single category
    getCategory: builder.query<any, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
        withToken: false,
      }),
      providesTags: ['Category'],
    }),

    // Track company view
    trackCompanyView: builder.mutation<any, { companyId: string; type: 'click' | 'hover' }>({
      query: ({ companyId, type }) => ({
        url: `/company/${companyId}/view`,
        method: 'POST',
        data: { type },
        withToken: false, // No token required for view tracking
      }),
    }),

    // Approve a company
    approveCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}/approve`,
        method: 'PATCH',
        withToken: true,
      }),
      invalidatesTags: ['Company'], // Invalidate 'Company' tag to refetch list
    }),

    // Delete a company
    deleteCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}`, // Fixed: use plural 'companies' not singular 'company'
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Company'], // Invalidate 'Company' tag to refetch list
    }),
  }),
});

// Export auto-generated hooks for use in components
export const {
  useGetCompaniesQuery,
  useGetCategoryQuery,
  useTrackCompanyViewMutation,
  useApproveCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;