import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  GetMeResponse,
  UserStatusResponse,
  CreateAdminRequest,
  CreateAdminResponse,
  PendingIdentitiesResponse,
  AllIdentitiesResponse,
  IdentityDetailResponse,
  ApproveIdentityResponse,
  RejectIdentityRequest,
  RejectIdentityResponse,
  HealthResponse,
  CreateCinResponse,
  GetCinResponse,
} from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * API error class
 */
class ApiError extends Error {
  constructor(
    public status: number,
    public data: any,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API client for Digital Identity API
 * Handles authentication, request/response transformation, and error handling
 */
class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage if available
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      this.token = storedToken;
    }
  }

  /**
   * Set the authentication token
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Get the current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear the authentication token
   */
  clearToken() {
    this.setToken(null);
  }

  /**
   * Make a fetch request with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      ...options.headers,
    };

    // Add auth token if available
    if (this.token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text')) {
      data = await response.text();
    } else {
      data = null;
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data,
        data?.message || `HTTP ${response.status}`
      );
    }

    return data as T;
  }

  /**
   * HEALTH: Check service health
   */
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  /**
   * AUTH: Register a new user
   * POST /api/auth/register
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('fatherName', data.fatherName);
    formData.append('motherName', data.motherName);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('placeOfBirth', data.placeOfBirth);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('idPhoto', data.idPhoto);

    return this.request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * AUTH: Login with email and password
   * POST /api/auth/login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const result = await this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Store token if login successful
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  /**
   * AUTH: Get currently authenticated user
   * GET /api/auth/me
   */
  async getMe(): Promise<GetMeResponse> {
    return this.request<GetMeResponse>('/api/auth/me');
  }

  /**
   * USER: Get authenticated user's full profile
   * GET /api/user/profile
   */
  async getUserProfile(): Promise<GetMeResponse> {
    return this.request<GetMeResponse>('/api/user/profile');
  }

  /**
   * USER: Get identity status
   * GET /api/user/status
   */
  async getUserStatus(): Promise<UserStatusResponse> {
    return this.request<UserStatusResponse>('/api/user/status');
  }

  /**
   * ADMIN: Create an admin account
   * POST /api/admin/create
   * Can use either x-admin-secret header or bearer token
   */
  async createAdmin(
    data: CreateAdminRequest,
    adminSecret?: string
  ): Promise<CreateAdminResponse> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (adminSecret) {
      headers['x-admin-secret'] = adminSecret;
    }

    return this.request<CreateAdminResponse>('/api/admin/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  /**
   * ADMIN: Get pending identities
   * GET /api/admin/identities/pending
   */
  async getPendingIdentities(page = 1, limit = 20): Promise<PendingIdentitiesResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return this.request<PendingIdentitiesResponse>(
      `/api/admin/identities/pending?${params}`
    );
  }

  /**
   * ADMIN: Get all identities with optional status filter
   * GET /api/admin/identities
   */
  async getAllIdentities(
    page = 1,
    limit = 20,
    status?: string
  ): Promise<AllIdentitiesResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) {
      params.append('status', status);
    }
    return this.request<AllIdentitiesResponse>(`/api/admin/identities?${params}`);
  }

  /**
   * ADMIN: Get single identity detail
   * GET /api/admin/identities/{id}
   */
  async getIdentityDetail(id: string): Promise<IdentityDetailResponse> {
    return this.request<IdentityDetailResponse>(`/api/admin/identities/${id}`);
  }

  /**
   * ADMIN: Approve a pending identity
   * PATCH /api/admin/identities/{id}/approve
   */
  async approveIdentity(id: string): Promise<ApproveIdentityResponse> {
    return this.request<ApproveIdentityResponse>(
      `/api/admin/identities/${id}/approve`,
      {
        method: 'PATCH',
      }
    );
  }

  /**
   * ADMIN: Reject a pending identity
   * PATCH /api/admin/identities/{id}/reject
   */
  async rejectIdentity(
    id: string,
    data: RejectIdentityRequest
  ): Promise<RejectIdentityResponse> {
    return this.request<RejectIdentityResponse>(
      `/api/admin/identities/${id}/reject`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
  }

  // ===========================================================================
  // CIN Endpoints
  // ===========================================================================

  /**
   * CIN: Create a Carte d'Identité Nationale
   * POST /api/cin
   */
  async createCin(cinPhoto: File): Promise<CreateCinResponse> {
    const formData = new FormData();
    formData.append('cinPhoto', cinPhoto);

    return this.request<CreateCinResponse>('/api/cin', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * CIN: Get my CIN
   * GET /api/cin
   */
  async getMyCin(): Promise<GetCinResponse> {
    return this.request<GetCinResponse>('/api/cin');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for testing/reset
export const resetApiClient = () => {
  apiClient.clearToken();
};

