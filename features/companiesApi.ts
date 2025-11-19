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
        // Simplified URL building. Assumes the API can handle combined query params.
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
          params, // Pass all filters as query parameters
          withToken: true,
        };
      },
      providesTags: ['Company'], // Provides the 'Company' tag
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

    // Approve a company
    approveCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}/approve`,
        method: 'PATCH',
        withToken: true,
      }),
      invalidatesTags: ['Company'], // Invalidate the 'Company' tag to refetch the list
    }),

    // Delete a company
    deleteCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `/company/${companyId}`, // Note: your original URL was `/company/` (singular)
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Company'], // Invalidate the 'Company' tag to refetch the list
    }),
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetCompaniesQuery,
  useGetCategoryQuery,
  useApproveCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;