/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';
import Cookies from 'js-cookie';

// ==========================================
// 🔗 BASE URL FROM ENV
// ==========================================
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ==========================================
// 🔐 BaseQuery TypeScript Interface
// ==========================================
export interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  withToken?: boolean;
  isFormData?: boolean;
}

// ==========================================
// 🚀 Axios Base Query (Strong TS)
// ==========================================
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async (
    { url, method, data, params, withToken, isFormData },
    { signal }
  ) => {
    try {
      const headers: Record<string, string> = {};

      // ==========================================
      // 🔐 GET TOKEN FROM COOKIE (TypeScript Safe)
      // ==========================================
      if (withToken) {
        const token: string | undefined = Cookies.get('auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      // ==========================================
      // 📝 SET CONTENT TYPE
      // ==========================================
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      // ==========================================
      // 📡 SEND REQUEST
      // ==========================================
      const response: AxiosResponse = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
        signal,
      });

      return { data: response.data };
    } catch (error) {
      const err = error as AxiosError;

      // ==========================================
      // ❌ HANDLE CANCELLED REQUEST
      // ==========================================
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
        return {
          error: {
            status: 'CANCELLED',
            data: 'Request was cancelled',
          },
        };
      }

      // ==========================================
      // ⚠️ RETURN API ERROR
      // ==========================================
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
