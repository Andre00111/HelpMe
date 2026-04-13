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
    console.log('📤 [AuthService] POST /auth/register:', { email: payload.email, name: payload.name });
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    console.log('✅ [AuthService] Register erfolgreich:', { userId: response.data.userId, email: response.data.email });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    console.log('📤 [AuthService] POST /auth/login:', { email: payload.email });
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    console.log('✅ [AuthService] Login erfolgreich:', { userId: response.data.userId, email: response.data.email });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    console.log('📤 [AuthService] GET /auth/me');
    const response = await apiClient.get<User>('/auth/me');
    console.log('✅ [AuthService] getCurrentUser erfolgreich:', { userId: response.data.id });
    return response.data;
  }

  async getProfiles(): Promise<any[]> {
    console.log('📤 [AuthService] GET /auth/profiles');
    const response = await apiClient.get<any[]>('/auth/profiles');
    console.log('✅ [AuthService] Profiles geladen:', { count: response.data.length });
    return response.data;
  }

  logout(): void {
    console.log('🚪 [AuthService] Logout');
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
