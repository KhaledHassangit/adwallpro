const API_BASE_URL = "https://adwallpro.com/api/v1";

export interface Company {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  category: string;
  logo?: string;
  phone: string;
  email: string;
  website?: string;
  country: string;
  city: string;
  address: string;
  isVip?: boolean;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class CompaniesAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get auth token from localStorage
    const token = localStorage.getItem("auth_token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response structures
      if (data.data) {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Get all companies
  async getAllCompanies(): Promise<Company[]> {
    return this.request<Company[]>("/companies");
  }

  // Get companies by category
  async getCompaniesByCategory(categorySlug: string): Promise<Company[]> {
    return this.request<Company[]>(`/companies/category/${categorySlug}`);
  }

  // Get pending companies (for admin)
  async getPendingCompanies(): Promise<Company[]> {
    return this.request<Company[]>("/companies/pending");
  }

  // Search companies by name
  async searchCompanies(query: string): Promise<Company[]> {
    return this.request<Company[]>(
      `/companies/search?name=${encodeURIComponent(query)}`
    );
  }

  // Get single company
  async getCompany(id: string): Promise<Company> {
    return this.request<Company>(`/companies/${id}`);
  }

  // Create new company
  async createCompany(
    companyData: Omit<Company, "_id" | "id">
  ): Promise<Company> {
    return this.request<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    });
  }

  // Update company
  async updateCompany(
    id: string,
    companyData: Partial<Company>
  ): Promise<Company> {
    return this.request<Company>(`/companies/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(companyData),
    });
  }

  // Delete company
  async deleteCompany(id: string): Promise<void> {
    return this.request<void>(`/companies/delete/${id}`, {
      method: "DELETE",
    });
  }

  // Approve company (admin only)
  async approveCompany(id: string): Promise<Company> {
    return this.request<Company>(`/companies/${id}/approve`, {
      method: "PATCH",
    });
  }

  // Get companies count by category
  async getCompaniesCountByCategory(categorySlug: string): Promise<number> {
    try {
      const companies = await this.getCompaniesByCategory(categorySlug);
      return Array.isArray(companies) ? companies.length : 0;
    } catch (error) {
      console.error(
        `Error getting companies count for category ${categorySlug}:`,
        error
      );
      return 0;
    }
  }

  // Get multiple categories companies count
  async getMultipleCategoriesCount(
    categorySlugs: string[]
  ): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    const promises = categorySlugs.map(async (slug) => {
      try {
        const count = await this.getCompaniesCountByCategory(slug);
        counts[slug] = count;
      } catch (error) {
        counts[slug] = 0;
      }
    });

    await Promise.all(promises);
    return counts;
  }

  // Get all companies for a specific user
  async getUserCompanies(userId: string): Promise<Company[]> {
    return this.request<Company[]>(`/companies/user/${userId}`);
  }

  // Get a specific company for a specific user
  async getUserCompany(userId: string, companyId: string): Promise<Company> {
    return this.request<Company>(
      `/companies/user/${userId}/company/${companyId}`
    );
  }

  // Get user's companies by status (approved/pending)
  async getUserCompaniesByStatus(
    userId: string,
    status: "approved" | "pending"
  ): Promise<Company[]> {
    return this.request<Company[]>(
      `/companies/user/${userId}/status/${status}`
    );
  }
}

export const companiesAPI = new CompaniesAPI();

// Export individual functions for convenience
export const {
  getAllCompanies,
  getCompaniesByCategory,
  getPendingCompanies,
  searchCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  approveCompany,
  getCompaniesCountByCategory,
  getMultipleCategoriesCount,
  getUserCompanies,
  getUserCompany,
  getUserCompaniesByStatus,
} = companiesAPI;
