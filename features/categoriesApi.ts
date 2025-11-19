import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { Category, CategoryStats, UpdateCategoryParams } from '@/types/types';


export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Category'], // Tag for cache invalidation
  endpoints: (builder) => ({
    // Get Category Statistics
    getCategoryStats: builder.query<CategoryStats, void>({
      query: () => ({
        url: '/categories/stats',
        method: 'GET',
        withToken: true,
      }),
    }),

    // Get all Categories
    getCategories: builder.query<{ data: { data: Category[] } }, void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
        withToken: false,
      }),
      providesTags: ['Category'],
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

    // Update a Category
    updateCategory: builder.mutation<Category, UpdateCategoryParams>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        data: formData,
        isFormData: true, // Important: Tell axiosBaseQuery this is FormData
        withToken: true,
      }),
      invalidatesTags: ['Category'], // Invalidate the 'Category' tag to refetch the list
    }),

        getCategory: builder.query<Category, string>({
          query: (id) => ({
            url: `/categories/${id}`,
            method: 'GET',
          }),
          providesTags: ['Category'],
        }),
        
    // Delete a Category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
        withToken: true,
      }),
      invalidatesTags: ['Category'], // Invalidate the 'Category' tag to refetch the list
    }),
  }),
});

// Export the auto-generated hooks for use in components
export const {
  useGetCategoryStatsQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;