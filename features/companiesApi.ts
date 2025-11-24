// @/features/companiesApi.js

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { CompaniesResponse, GetCompaniesParams } from '@/types/types';

export const companiesApi = createApi({
  reducerPath: 'companiesApi',
  // Assuming axiosBaseQuery is configured with your base URL: http://72.60.178.180:8000/api/v1/
  baseQuery: axiosBaseQuery(), 
  tagTypes: ['Company', 'Category'], // It's good practice to list all tags you use
  endpoints: (builder) => ({
    // Get Companies with filters and pagination
    getCompanies: builder.query<CompaniesResponse, GetCompaniesParams>({
      query: (params) => {
        let url = '/companies';
        
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
            page: params.page || 1,
            limit: params.limit || 10,
            ...(params.search && { search: params.search }),
            ...(params.country && { country: params.country }),
            ...(params.city && { city: params.city }),
          },
          withToken: true,
        };
      },
      providesTags: ['Company'],
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

    // ✅ THIS IS THE CORRECT VIEW TRACKING MUTATION
    trackCompanyView: builder.mutation<any, {companyId: string; type: 'click' | 'hover' }>({
      // The 'query' function receives the argument from your component: { companyId, type }
      query: ({ companyId, type }) => ({
        // This constructs the URL: http://72.60.178.180:8000/api/v1/company/{companyId}/view
        url: `/companies/${companyId}/views`,
        
        // This ensures the request method is POST
        method: 'PATCH',
        
        // This sends the { type: 'click' } or { type: 'hover' } in the request body
        data: { type },
        
        // This correctly assumes no authentication token is needed for this action
        withToken: false,
      }),
      // No 'invalidatesTags' is needed here as we are just posting data
      // and not updating the list of companies in the cache.
    }),

    // Approve a company
    approveCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}/approve`,
        method: 'PATCH',
        withToken: true,
      }),
      invalidatesTags: ['Company'], // This refetches the companies list after approval
    }),

    // Delete a company
    deleteCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}`,
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Company'], // This refetches the companies list after deletion
    }),
  }),
});

// Export the auto-generated hooks for use in your components
export const {
  useGetCompaniesQuery,
  useGetCategoryQuery,
  useTrackCompanyViewMutation, // This hook is correctly exported and used
  useApproveCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;