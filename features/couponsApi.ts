import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../lib/baseURL';
import { Coupon, GetCouponsApiResponse,  } from '@/types/types';


export const couponsApi = createApi({
    reducerPath: 'couponsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Coupon'], // Tag for cache invalidation
    endpoints: (builder) => ({
        // Get all Coupons
        getCoupons: builder.query<GetCouponsApiResponse, { page?: number; limit?: number } | void>({
            query: (params) => {
                const page = params && 'page' in params ? params.page : 10;
                const limit = params && 'limit' in params ? params.limit : 10;
                return {
                    url: `/coupons?page=${page}&limit=${10}`,
                    method: 'GET',
                    withToken: true,
                };
            },
            providesTags: ['Coupon'], // Provides the 'Coupon' tag
        }),

        // Create a new Coupon
        createCoupon: builder.mutation<Coupon, {
            couponCode: string;
            startDate: string;
            expiryDate: string;
            discountValue: number;
            discountType: "percentage" | "fixed";
            maxUses: number;
            isActive: boolean;
        }>({
            query: (couponData) => ({
                url: '/coupons',
                method: 'POST',
                data: couponData,
                withToken: true,
            }),
            invalidatesTags: ['Coupon'], // Invalidate the 'Coupon' tag to refetch the list
        }),

        // Update a Coupon
        updateCoupon: builder.mutation<Coupon, {
            id: string;
            couponData: {
                couponCode: string;
                startDate: string;
                expiryDate: string;
                discountValue: number;
                discountType: "percentage" | "fixed";
                maxUses: number;
                isActive: boolean;
            };
        }>({
            query: ({ id, couponData }) => ({
                url: `/coupons/${id}`,
                method: 'PUT',
                data: couponData,
                withToken: true,
            }),
            invalidatesTags: ['Coupon'], // Invalidate the 'Coupon' tag to refetch the list
        }),

        // Delete a Coupon
        deleteCoupon: builder.mutation<void, string>({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: 'DELETE',
                withToken: true,
            }),
            invalidatesTags: ['Coupon'], // Invalidate the 'Coupon' tag to refetch the list
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponsApi;