import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/baseURL';
import { Category, CategoryStats, UpdateCategoryParams } from '@/types/types';

interface PaginatedCategoriesResponse {
  status: string;
  message: string;
  data: {
    results: number;
    paginationResult?: {
      currentPage: number;
      numberOfPages: number;
      limit: number;
    };
    data: Category[];
  };
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // Get Category Statistics
    getCategoryStats: builder.query<CategoryStats, void>({
      query: () => ({
        url: '/categories/stats',
        method: 'GET',
        withToken: true,
      }),
    }),

    // Get all Categories with Pagination, Sorting, and Search
    getCategories: builder.query<PaginatedCategoriesResponse, {
      page?: number;
      limit?: number;
      sort?: string;
      keyword?: string;
      category?: string;
    }>({
      query: ({ page = 1, limit = 100, sort, keyword, category }) => {
        // If a specific category ID is provided, fetch that single category
        if (category) {
          return {
            url: `/categories/${category}`,
            method: 'GET',
            withToken: false,
          };
        }

        // Build the query object
        const queryParams: { page: string; limit: string; sort?: string; keyword?: string } = {
          page: String(page),
          limit: String(limit),
        };

        if (sort) queryParams.sort = sort;
        if (keyword) queryParams.keyword = keyword;

        const hasSearchOrFilter = keyword;
        const baseUrl = hasSearchOrFilter ? '/categories/search' : '/categories';

        let searchParams = new URLSearchParams();
        if (keyword) searchParams.append('keyword', keyword);
        searchParams.append('page', String(page));
        searchParams.append('limit', String(limit));

        return {
          url: hasSearchOrFilter ? `${baseUrl}?${searchParams.toString()}` : baseUrl,
          method: 'GET',
          params: hasSearchOrFilter ? {} : queryParams,
          withToken: false,
        };
      },
      transformResponse: (response: any, meta, arg) => {
        // If we fetched a single category (by ID), wrap it in the paginated structure
        if (arg.category) {
          const categoryData = response.data || response;
          return {
            status: 'success',
            message: 'Category fetched successfully',
            data: {
              results: 1,
              paginationResult: {
                currentPage: 1,
                numberOfPages: 1,
                limit: 1,
              },
              data: [categoryData],
            },
          };
        }
        return response;
      },
      providesTags: ['Category'],
    }),

    // Get a single Category by its ID
    getCategory: builder.query<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // Create a new Category
    createCategory: builder.mutation<Category, FormData>({
      query: (formData) => ({
        url: '/categories',
        method: 'POST',
        data: formData,
        isFormData: true,
        withToken: true,
      }),
      invalidatesTags: ['Category'],
    }),

    // Update an existing Category
    updateCategory: builder.mutation<Category, UpdateCategoryParams>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        data: formData,
        isFormData: true,
        withToken: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),

    // Delete a Category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoryStatsQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;