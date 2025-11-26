// @/features/companiesApi.ts

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { CompaniesResponse, GetCompaniesParams } from '@/types/types';

export const companiesApi = createApi({
  reducerPath: 'companiesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Company', 'Category'],
  endpoints: (builder) => ({
    // Get Companies with filters and pagination
    getCompanies: builder.query<CompaniesResponse, GetCompaniesParams>({
      query: (params) => {
        let url = '/companies';
        const queryParams: any = {
          page: params.page || 1,
          limit: params.limit || 10,
        };

        // Handle Category Page Request (specific endpoint)
        if (params.useCategoryEndpoint && params.categoryId) {
          url = `/companies/category/${params.categoryId}`;
        }
        // Handle General Search/Filter Requests
        else {
          // Add filters to query params
          if (params.status && params.status !== 'all') queryParams.status = params.status;
          if (params.categoryId && params.categoryId !== 'all') queryParams.categoryId = params.categoryId;
        }

        // Add common search params
        if (params.search) queryParams.search = params.search;
        if (params.keyword) queryParams.keyword = params.keyword;
        if (params.country) queryParams.country = params.country;
        if (params.city) queryParams.city = params.city;

        return {
          url,
          method: 'GET',
          params: queryParams,
          withToken: true,
        };
      },
      providesTags: ['Company'],
    }),

    // Get a single company by ID
    getCompanyById: builder.query<any, string>({
      query: (id) => ({
        url: `/companies/${id}`,
        method: 'GET',
        withToken: true,
      }),
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

    // Track company view
    trackCompanyView: builder.mutation<any, { companyId: string; type: 'click' | 'hover' }>({
      query: ({ companyId, type }) => ({
        url: `/companies/${companyId}/views`,
        method: 'PATCH',
        data: { type },
        withToken: false,
      }),
    }),

    // Approve a company
    approveCompany: builder.mutation<void, { id: string; isApproved: boolean }>({
      query: ({ id, isApproved }) => ({
        url: `/companies/${id}/approve`,
        method: 'PATCH',
        data: { isApproved },
        withToken: true,
      }),
      invalidatesTags: ['Company'],
    }),

    // Delete a company
    deleteCompany: builder.mutation<void, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}`,
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Company'],
    }),

    // Get Pending Companies (Admin)
    getPendingCompanies: builder.query<CompaniesResponse, { page?: number; limit?: number; keyword?: string }>({
      query: (params) => ({
        url: '/companies/admin/pending',
        method: 'GET',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...(params?.keyword && { keyword: params.keyword }),
        },
        withToken: true,
      }),
      providesTags: ['Company'],
    }),

    // Get Approved Companies (Admin)
    getApprovedCompanies: builder.query<CompaniesResponse, { page?: number; limit?: number; keyword?: string }>({
      query: (params) => ({
        url: '/companies/admin/approved',
        method: 'GET',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...(params?.keyword && { keyword: params.keyword }),
        },
        withToken: true,
      }),
      providesTags: ['Company'],
    }),

    // Get Rejected Companies (Admin)
    getRejectedCompanies: builder.query<CompaniesResponse, { page?: number; limit?: number; keyword?: string }>({
      query: (params) => ({
        url: '/companies/admin/rejected',
        method: 'GET',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...(params?.keyword && { keyword: params.keyword }),
        },
        withToken: true,
      }),
      providesTags: ['Company'],
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useGetCategoryQuery,
  useTrackCompanyViewMutation,
  useApproveCompanyMutation,
  useDeleteCompanyMutation,
  useGetPendingCompaniesQuery,
  useGetApprovedCompaniesQuery,
  useGetRejectedCompaniesQuery,
} = companiesApi;