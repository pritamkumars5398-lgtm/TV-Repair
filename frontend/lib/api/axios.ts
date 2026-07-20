import axios from 'axios';
import { logger } from '../logger';

const apiLogger = logger.withCategory('api');

// Normalize API URL to ensure the /api/v1 prefix is always present
let apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
if (apiBaseURL && !apiBaseURL.includes('/api/v1')) {
  const cleanBase = apiBaseURL.endsWith('/') ? apiBaseURL.slice(0, -1) : apiBaseURL;
  apiBaseURL = `${cleanBase}/api/v1`;
}

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  // Attach metadata for response duration calculation
  (config as any).metadata = { startTime: new Date() };

  if (typeof document !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1] ||
      document.cookie
      .split('; ')
      .find((row) => row.startsWith('customerToken='))
      ?.split('=')[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  apiLogger.debug(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, {
    params: config.params,
    data: config.data,
  });

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const startTime = (response.config as any).metadata?.startTime;
    const duration = startTime ? `${new Date().getTime() - startTime.getTime()}ms` : 'unknown';

    apiLogger.info(`✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration})`, {
      data: response.data,
    });

    return response;
  },
  (error) => {
    const startTime = (error.config as any)?.metadata?.startTime;
    const duration = startTime ? `${new Date().getTime() - startTime.getTime()}ms` : 'unknown';
    const status = error.response?.status || 'NETWORK_ERROR';

    apiLogger.error(`❌ Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${status} (${duration})`, {
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      document.cookie = 'auth_token=; path=/; max-age=0';
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/manager')) {
        window.location.href = '/admin/login';
      } else if (currentPath.startsWith('/portal')) {
        window.location.href = '/portal/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
