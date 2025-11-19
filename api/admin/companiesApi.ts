import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseURL';

// Define the shape of the data for type safety
export interface Company {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
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
  categoryId: {
    nameAr: string;
    nameEn: string;
    color: string;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface CompaniesResponse {
  status: string;
  results: number;
  data: {
      data: Company[];
  };
}

// Define the parameters for the fetch query
export interface GetCompaniesParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  country?: string;
  city?: string;
  categoryId?: string;
}

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
  useApproveCompanyMutation,
  useDeleteCompanyMutation,
} = companiesApi;