import apiClient from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  isHelper: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  name: string;
  email: string;
  isHelper: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isHelper: boolean;
  helperOfId?: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

class AuthService {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export default new AuthService();
