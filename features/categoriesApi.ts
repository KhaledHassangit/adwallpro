import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/baseURL'; // Adjust path if needed
import { Category, CategoryStats, UpdateCategoryParams } from '@/types/types'; // Adjust path if needed

// Define a type for the expected paginated response for better type safety and developer experience.
// This structure should match what your backend API returns.
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
  tagTypes: ['Category'], // This tag is used for cache invalidation
  endpoints: (builder) => ({
    // Get Category Statistics
    getCategoryStats: builder.query<CategoryStats, void>({
      query: () => ({
        url: '/categories/stats',
        method: 'GET',
        withToken: true, // This endpoint requires authentication
      }),
    }),

    // Get all Categories with Pagination, Sorting, and Search
    getCategories: builder.query<PaginatedCategoriesResponse, { 
      page?: number; 
      limit?: number; 
      sort?: string;
      keyword?: string;
      category?: string; // Add category filter parameter
    }>({
      query: ({ page = 1, limit = 100, sort, keyword, category }) => {
        // Build the query object. Only include parameters if they're provided.
        const queryParams: { page: string; limit: string; sort?: string; keyword?: string; category?: string } = {
          page: String(page),
          limit: String(limit),
        };
        
        if (sort) {
          queryParams.sort = sort;
        }
        
        if (keyword) {
          queryParams.keyword = keyword;
        }
        
        if (category) {
          queryParams.category = category;
        }

        // Determine the URL based on whether we have search/filter parameters
        const hasSearchOrFilter = keyword || category;
        const baseUrl = hasSearchOrFilter ? '/categories/search' : '/categories';
        
        // Build query parameters for search/filter
        let searchParams = new URLSearchParams();
        if (keyword) searchParams.append('keyword', keyword);
        if (category) searchParams.append('category', category);
        searchParams.append('page', String(page));
        searchParams.append('limit', String(limit));

        return {
          url: hasSearchOrFilter ? `${baseUrl}?${searchParams.toString()}` : baseUrl,
          method: 'GET',
          params: hasSearchOrFilter ? {} : queryParams, // Only send params for non-search requests
          withToken: false, // Set to true if this endpoint requires authentication
        };
      },
      // providesTags is used to cache the data. When a tag is invalidated, RTK Query will refetch the data.
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
        isFormData: true, // Important: Tell axiosBaseQuery to handle FormData correctly
        withToken: true, // This endpoint requires authentication
      }),
      // invalidatesTags will cause the 'getCategories' query to re-run, updating the list with the new category.
      invalidatesTags: ['Category'],
    }),

    // Update an existing Category
    updateCategory: builder.mutation<Category, UpdateCategoryParams>({
      query: ({ id, formData }) => ({
        url: `/categories/${id}`,
        method: 'PUT', // or 'PATCH' depending on your API
        data: formData,
        isFormData: true, // Important: Tell axiosBaseQuery to handle FormData correctly
        withToken: true, // This endpoint requires authentication
      }),
      // This will also refresh the list to show the updated category.
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),

    // Delete a Category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
        withToken: true, // This endpoint requires authentication
      }),
      // This will refresh the list, removing the deleted category.
      invalidatesTags: ['Category'],
    }),
  }),
});

// Export the auto-generated hooks for use in your components.
// These hooks follow the naming convention: use + EndpointName + Query/Mutation.
export const {
  useGetCategoryStatsQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;