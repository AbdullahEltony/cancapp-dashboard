const BASE_URL = 'https://cancapp.runasp.net';

// Types matching the backend models
export interface AuthResponse {
  id: string;
  email: string;
  userName: string;
  name: string;
  address: string;
  image: string;
  token: string;
  expiresIn: number;
  refreshToken: string;
  userType: string;
  refreshTokenExpiration: string;
}

export interface NumberOfUsersResponse {
  numberOfUsers: number;
  numberOfDoctors: number;
  numberOfPatients: number;
  numberOfPharmacist: number;
  numberOfVolunteers: number;
  numberOfPsychiatrist: number;
}

export interface CompleteProfileResponse {
  imageId: string;
  medicalProve: string;
  userType: string;
  userId: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  postId: number;
  time: string;
  userId: string;
  userImageUrl: string;
  name: string;
  reactionsNumber: number;
}

export interface PostResponse {
  id: number;
  time: string;
  content: string;
  userProgilePictureUrl: string;
  imageUrl: string;
  userId: string;
  name: string;
  commentsCount: number;
  reactionsCount: number;
  reactions: ReactionResponse[];
}

export interface ReactionResponse {
  time: string;
  postId: number;
  commentId: number | null;
  userId: string;
  name: string;
  userImageUrl: string;
  isComment: boolean;
}

export interface DashboardRequest {
  id: string;
}

// Backend Result wrapper interface
export interface ApiResult<T> {
  isSuccess: boolean;
  value?: T;
  errors?: string[];
}

class ApiService {
  private baseUrl = BASE_URL;

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('adminToken');
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`Making request to: ${url}`);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || errorData.title || `API Error: ${response.status} ${response.statusText}`);
      } catch {
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    // Handle empty response
    const responseText = await response.text();
    if (!responseText) {
      return undefined;
    }
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      throw new Error('Invalid JSON response from server');
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/Dashboard/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    localStorage.setItem('adminToken', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response));
    
    return response;
  }

  // Dashboard Stats
  async getUserStats(): Promise<NumberOfUsersResponse> {
    try {
      const result = await this.request<ApiResult<NumberOfUsersResponse>>('/api/Dashboard/UserCharts');
      console.log('API Response (Result wrapper):', result);
      if (result.isSuccess && result.value) {
        return result.value;
      }
      throw new Error(result.errors?.join(', ') || 'Failed to get user stats');
    } catch (error) {
      console.log('Result wrapper failed, trying direct format:', error);
      // Try direct response format if Result wrapper fails
      try {
        const directResult = await this.request<NumberOfUsersResponse>('/api/Dashboard/UserCharts');
        console.log('API Response (Direct):', directResult);
        return directResult;
      } catch (directError) {
        console.error('Both formats failed:', directError);
        throw new Error('Failed to get user stats');
      }
    }
  }

  // Profile Verification
  async getUncompletedProfiles(): Promise<CompleteProfileResponse[]> {
    try {
      const result = await this.request<ApiResult<CompleteProfileResponse[]>>('/api/Dashboard/UnCompletedProfile');
      if (result.isSuccess && result.value) {
        return result.value;
      }
      throw new Error(result.errors?.join(', ') || 'Failed to get uncompleted profiles');
    } catch (error) {
      // Try direct response format if Result wrapper fails
      try {
        const directResult = await this.request<CompleteProfileResponse[]>('/api/Dashboard/UnCompletedProfile');
        return directResult;
      } catch (directError) {
        throw new Error('Failed to get uncompleted profiles');
      }
    }
  }

  async confirmProfile(userId: string): Promise<void> {
    return this.request('/api/Dashboard/ConfirmCompleteProfile', {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    });
  }

  async failProfile(userId: string): Promise<void> {
    return this.request('/api/Dashboard/FailCompleteProfile', {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    });
  }

  // User Management
  async disableUser(userId: string): Promise<void> {
    return this.request('/api/Dashboard/disable', {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    });
  }

  async enableUser(userId: string): Promise<void> {
    return this.request('/api/Dashboard/enable', {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    });
  }

  async addWarning(userId: string): Promise<void> {
    return this.request('/api/Dashboard/warning', {
      method: 'POST',
      body: JSON.stringify({ id: userId }),
    });
  }

  // Content Moderation
  async getReportedComments(): Promise<CommentResponse[]> {
    try {
      const result = await this.request<ApiResult<CommentResponse[]>>('/api/Dashboard/reported-comments');
      if (result.isSuccess && result.value) {
        return result.value;
      }
      throw new Error(result.errors?.join(', ') || 'Failed to get reported comments');
    } catch (error) {
      // Try direct response format if Result wrapper fails
      try {
        const directResult = await this.request<CommentResponse[]>('/api/Dashboard/reported-comments');
        return directResult;
      } catch (directError) {
        throw new Error('Failed to get reported comments');
      }
    }
  }

  async getReportedPosts(): Promise<PostResponse[]> {
    try {
      const result = await this.request<ApiResult<PostResponse[]>>('/api/Dashboard/reported-posts');
      if (result.isSuccess && result.value) {
        return result.value;
      }
      throw new Error(result.errors?.join(', ') || 'Failed to get reported posts');
    } catch (error) {
      // Try direct response format if Result wrapper fails
      try {
        const directResult = await this.request<PostResponse[]>('/api/Dashboard/reported-posts');
        return directResult;
      } catch (directError) {
        throw new Error('Failed to get reported posts');
      }
    }
  }

  async getTopPosts(): Promise<PostResponse[]> {
    try {
      const result = await this.request<ApiResult<PostResponse[]>>('/api/Dashboard/top-posts');
      if (result.isSuccess && result.value) {
        return result.value;
      }
      throw new Error(result.errors?.join(', ') || 'Failed to get top posts');
    } catch (error) {
      // Try direct response format if Result wrapper fails
      try {
        const directResult = await this.request<PostResponse[]>('/api/Dashboard/top-posts');
        return directResult;
      } catch (directError) {
        throw new Error('Failed to get top posts');
      }
    }
  }

  // Utility methods
  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Test method to check API connectivity
  async testConnection(): Promise<void> {
    try {
      console.log('Testing API connection...');
      const response = await fetch(`${this.baseUrl}/api/Dashboard/UserCharts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Test response status:', response.status);
      const text = await response.text();
      console.log('Test response text:', text);
      
      if (response.ok) {
        console.log('API connection successful');
      } else {
        console.error('API connection failed');
      }
    } catch (error) {
      console.error('API connection error:', error);
    }
  }
}

export const apiService = new ApiService();
