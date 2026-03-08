import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Disabled for development
});

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request interceptor - add Bearer token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Don't redirect on auth errors - just reject
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),
  
  logout: () => apiClient.post('/auth/logout'),
  
  refresh: () => apiClient.post<AuthResponse>('/auth/refresh'),
  
  me: () => apiClient.get<{ user: User }>('/auth/me'),
};

// Subjects API
export const subjectsApi = {
  getAll: (params?: { page?: number; pageSize?: number; q?: string }) =>
    apiClient.get<{ subjects: Subject[]; pagination: any }>('/subjects', { params }),
  
  getById: (id: string) => apiClient.get<Subject>(`/subjects/${id}`),
  
  getBySlug: (slug: string) => apiClient.get<Subject>(`/subjects/slug/${slug}`),
  
  getTree: (id: string) => apiClient.get<SubjectTree>(`/subjects/${id}/tree`),
  
  getFirstVideo: (id: string) => apiClient.get<{ videoId: string }>(`/subjects/${id}/first-video`),
};

// Videos API
export const videosApi = {
  getById: (id: string) => apiClient.get<VideoDetail>(`/videos/${id}`),
  
  checkAccess: (id: string) => apiClient.get<{ accessible: boolean; reason?: string }>(`/videos/${id}/access`),
};

// Progress API
export const progressApi = {
  getSubjectProgress: (subjectId: string) =>
    apiClient.get<Progress>(`/progress/subjects/${subjectId}`),
  
  getVideoProgress: (videoId: string) =>
    apiClient.get<VideoProgress>(`/progress/videos/${videoId}`),
  
  updateVideoProgress: (videoId: string, data: { last_position_seconds?: number; is_completed?: boolean }) =>
    apiClient.post(`/progress/videos/${videoId}`, data),
  
  markCompleted: (videoId: string) =>
    apiClient.post(`/progress/videos/${videoId}/complete`),
};

import { AuthResponse, User, Subject, SubjectTree, VideoDetail, Progress, VideoProgress } from '@/types';
