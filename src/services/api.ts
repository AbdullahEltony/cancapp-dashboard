
const BASE_URL = 'http://cancapp.runasp.net';

export interface User {
  id: string;
  email: string;
  userName: string;
  name: string;
  address: string;
  image: string;
  userType: string;
  status?: string;
  warnings?: number;
  lastActive?: string;
}

export interface PendingProfile {
  id: string;
  userId: string;
  name: string;
  userType: string;
  profileImage: string;
  medicalLicense: string;
  submittedAt: string;
  specialty: string;
}

export interface ReportedPost {
  id: number;
  content: string;
  userImage: string;
  userName: string;
  userId: string;
  time: string;
  commentsCount: number;
  reactionsCount: number;
  postImage?: string;
  reportReason: string;
}

export interface ReportedComment {
  id: number;
  content: string;
  postId: number;
  time: string;
  userId: string;
  userImage: string;
  userName: string;
  reactionsCount: number;
  reportReason: string;
}

export interface TopPost {
  id: number;
  content: string;
  userImage: string;
  userName: string;
  userId: string;
  time: string;
  commentsCount: number;
  reactionsCount: number;
  engagementScore: number;
}

export interface DashboardStats {
  totalUsers: number;
  pendingVerifications: number;
  reportedContent: number;
  activeWarnings: number;
}

class ApiService {
  private baseUrl = BASE_URL;

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/api/admin/dashboard/stats');
  }

  // User Management
  async getUsers(): Promise<User[]> {
    return this.request('/api/admin/users');
  }

  async getUserById(userId: string): Promise<User> {
    return this.request(`/api/admin/users/${userId}`);
  }

  async updateUserStatus(userId: string, status: 'active' | 'disabled'): Promise<void> {
    return this.request(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async addUserWarning(userId: string, reason: string): Promise<void> {
    return this.request(`/api/admin/users/${userId}/warnings`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Profile Verification
  async getPendingProfiles(): Promise<PendingProfile[]> {
    return this.request('/api/admin/verifications/pending');
  }

  async approveProfile(profileId: string): Promise<void> {
    return this.request(`/api/admin/verifications/${profileId}/approve`, {
      method: 'POST',
    });
  }

  async rejectProfile(profileId: string, reason?: string): Promise<void> {
    return this.request(`/api/admin/verifications/${profileId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Content Moderation
  async getReportedPosts(): Promise<ReportedPost[]> {
    return this.request('/api/admin/content/reported-posts');
  }

  async getReportedComments(): Promise<ReportedComment[]> {
    return this.request('/api/admin/content/reported-comments');
  }

  async getTopPosts(): Promise<TopPost[]> {
    return this.request('/api/admin/content/top-posts');
  }

  async removePost(postId: number): Promise<void> {
    return this.request(`/api/admin/content/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async removeComment(commentId: number): Promise<void> {
    return this.request(`/api/admin/content/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async warnUserForContent(userId: string, contentType: 'post' | 'comment', contentId: number): Promise<void> {
    return this.request(`/api/admin/content/warn`, {
      method: 'POST',
      body: JSON.stringify({ userId, contentType, contentId }),
    });
  }

  // Activity Feed
  async getRecentActivity(): Promise<any[]> {
    return this.request('/api/admin/activity/recent');
  }

  // User Distribution
  async getUserDistribution(): Promise<any[]> {
    return this.request('/api/admin/users/distribution');
  }
}

export const apiService = new ApiService();
