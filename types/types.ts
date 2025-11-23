export type Role = "visitor" | "advertiser" | "admin";


export type AdStatus = "pending" | "approved" | "rejected";

// إعلان الشركة (شركة على جدار الإعلانات)
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

export interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  image: string;
  createdAt: string;
}

export interface CategoryStats {
  totalCategories: number;
  mostUsedCategory: string;
  systemStatus: string;
}

// Define parameters for the update mutation
export interface UpdateCategoryParams {
  id: string;
  formData: FormData;
}


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
  paginationResult?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: {
    data: Company[];
  };
}

export interface GetCompaniesParams {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  country?: string;
  city?: string;
  categoryId?: string;
}

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

export interface CouponsResponse {
  status: string;
  results: number;
  paginationResult?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: {
    data: Coupon[];
  };
}

export interface PlanOption {
  duration: string;
  priceUSD: number;
  discountPercent?: number;
  finalPriceUSD: number;
  adsCount: number;
  categories?: string[];
  _id?: string;
}

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

export interface ValidationError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export interface ApiError {
  errors: ValidationError[];
}

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




export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface UpdateProfileRequest {
  name: string;
  phone?: string;
}

export interface ValidationError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export interface ApiError {
  errors: ValidationError[];
}


export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  subscription?: {
    adsUsed: number;
    isActive: boolean;
    plan?: string;
    option?: string;
    startDate?: string;
    endDate?: string;
  };
  profileImg?: string;
  active: boolean;
  lastLogin?: string;
}

export interface UserStats {
  totalUsers: number;
  adminsCount: number;
  regularUsersCount: number;
  activeThisWeek: number;
  adminPercentage: string;
  regularUserPercentage: string;
  activePercentage: string;
}

export interface PaginatedUsersResponse {
  status: string;
  results: number;
  paginationResult?: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: {
    data: {
      users: User[];
    };
  };
}

export interface GetUsersParams {
  page: number;
  limit: number;
}
