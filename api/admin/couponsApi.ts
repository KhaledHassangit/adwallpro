import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseURL';

// Define the shape of the data for type safety
export interface Coupon {
    _id: string;
    couponCode: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    isActive: boolean;
    createdDate: string;
    expiryDate: string;
    startDate?: string;
    maxUses?: number;
    usedCount?: number;
}

// Define the shape of the API response
export interface CouponsResponse {
    status: string;
    results: number;
    data: {
        data: Coupon[];
    };
}

export const couponsApi = createApi({
    reducerPath: 'couponsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Coupon'], // Tag for cache invalidation
    endpoints: (builder) => ({
        // Get all Coupons
        getCoupons: builder.query<CouponsResponse, void>({
            query: () => ({
                url: '/coupons',
                method: 'GET',
                withToken: true,
            }),
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