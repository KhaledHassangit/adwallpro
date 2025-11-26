// types/types.ts

// Role types
export type Role = "visitor" | "advertiser" | "admin";

// Ad status type
export type AdStatus = "pending" | "approved" | "rejected";

// Company ad type
export type Ad = {
  id: string;
  companyName: string;
  description: string;
  category: string; // slug
  country: string;
  city: string;
  image: string; // صورة الغلاف أو واجهة الشركة
  logo?: string; // شعار الشركة
  isVip: boolean;
  phone: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  ownerEmail?: string; // حساب المُعلِن
  status: AdStatus; // حالة الإعلان
  submittedAt: string; // تاريخ التقديم
  reviewedAt?: string; // تاريخ المراجعة
  reviewedBy?: string; // من راجع الإعلان
  rejectionReason?: string; // سبب الرفض
};

// Analytics data interface
export interface AnalyticsData {
  userCount: number;
  adminCount: number;
  companies: {
    active: number;
    pending: number;
  };
  categoryCount: number;
  latestActivities: any[];
  charts?: {
    subscriptionsPerPlan?: {
      labels: string[];
      datasets: any[];
    };
  };
}

// User analytics interface
export interface UserAnalytics {
  totalAds: number;
  pendingAds: number;
  approvedAds: number;
  rejectedAds: number;
  totalViews: number;
  activeAdsList: any[];
  chartData: {
    labels: string[];
    data: number[];
  };
}

// Category interface
export interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  imageUrl: string;
  createdAt: string;
  image: string;
}

// Category stats interface
export interface CategoryStats {
  totalCategories: number;
  mostUsedCategory: string;
  systemStatus: string;
}

// Parameters for updating category
export interface UpdateCategoryParams {
  id: string;
  formData: FormData;
}

// Company interface
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

// Companies response interface
export interface CompaniesResponse {
  status: string;
  results: number;
  paginationResult?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: {
    data: Company[];
  };
}

// Parameters for getting companies
export interface GetCompaniesParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  keyword?: string;
  country?: string;
  city?: string;
  categoryId?: string;
  useCategoryEndpoint?: boolean;
}

// Coupon interface
export interface Coupon {
  _id: string;
  couponCode: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  isActive: boolean;
  startDate: string;      // ISO 8601 date string
  expiryDate: string;     // ISO 8601 date string
  maxUses: number;
  usedCount: number;
  createdAt: string;      // Corrected from 'createdDate'
  updatedAt: string;      // Added for completeness
}

// API response for coupons
export interface GetCouponsApiResponse {
  status: string;
  message: string;
  data: {
    results: number;
    paginationResult: {
      currentPage: number;
      limit: number;
      numberOfPages: number;
      next?: number;      // 'next' might not be on the last page
      prev?: number;      // 'prev' might not be on the first page
    };
    data: Coupon[];       // This is the array of coupons
  };
}

// Plan option interface
export interface PlanOption {
  duration: string;
  priceUSD: number;
  discountPercent?: number;
  finalPriceUSD: number;
  adsCount: number;
  categories?: string[];
  _id?: string;
}

// Plan interface
export interface Plan {
  _id?: string;
  name: string;
  code: string;
  color?: string;
  description?: string;
  planType: 'Basic' | 'Standard' | 'Premium' | 'Monthly';
  options: PlanOption[];
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Plans response interface
export interface PlansResponse {
  status: string;
  message: string;
  data: {
    results: number;
    paginationResult: {
      currentPage: number;
      limit: number;
      numberOfPages: number;
    };
    data: Plan[];
  };
}

// Categories response interface
export interface CategoriesResponse {
  status: string;
  message: string;
  data: {
    results: number;
    paginationResult: {
      currentPage: number;
      limit: number;
      numberOfPages: number;
    };
    data: Category[];
  };
}

// Validation error interface
export interface ValidationError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

// API error interface
export interface ApiError {
  errors?: ValidationError[];
  data?: {
    message?: string;
  };
}

// Subscription interface
export interface Subscription {
  _id: string;
  plan: {
    _id: string;
    name: string;
    code: string;
    color?: string;
    description?: string;
    planType?: string;
    options?: PlanOption[];
    features?: string[];
    isActive?: boolean;
  };
  status: string;
  expiresAt?: string;
  createdAt?: string;
}

// User profile interface
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

// Password change request interface
export interface PasswordChangeRequest {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

// Update profile request interface
export interface UpdateProfileRequest {
  name: string;
  phone?: string;
}

// User interface (matching the API response)
export interface User {
  _id: string;
  id: string; // Duplicate ID field that appears in your response
  name: string;
  email: string;
  phone: string;
  profileImg: string;
  profileImgUrl: string;
  role: "admin" | "user";
  active: boolean;
  wishlist: any[];
  lastLogin: string; // ISO date string
  addresses: any[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  slug: string;
  passwordChangedAt: string; // ISO date string
  passwordResetCode?: string; // Optional field
  passwordResetExpires?: string; // Optional field, ISO date string
  passwordResetVerified?: boolean; // Optional field
  subscription?: {
    adsUsed: number;
    isActive: boolean;
  };
}

// User stats interface
export interface UserStats {
  totalUsers: number;
  adminsCount: number;
  regularUsersCount: number;
  activeThisWeek: number;
}

// Paginated users response interface
export interface PaginatedUsersResponse {
  status: string;
  results: number;
  paginationResult?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: {
    users: User[];
  };
}

// Parameters for getting users
export interface GetUsersParams {
  page: number;
  limit: number;
  keyword?: string;
}