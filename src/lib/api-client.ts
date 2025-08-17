import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants';

export class ApiError extends Error {
  statusCode?: number;
  data?: any;

  constructor(message: string, statusCode?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

class ApiClient {
  private client: AxiosInstance;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        (config as any).metadata = { startTime: new Date() };
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        const endTime = new Date();
        const duration =
          endTime.getTime() -
          (response.config as any).metadata?.startTime?.getTime();
        if (duration > 3000) {
          console.warn(
            `Slow API call: ${response.config.url} took ${duration}ms`
          );
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          const errorMessage =
            (error.response.data as any)?.message || 'An error occurred';
          throw new ApiError(
            errorMessage,
            error.response.status,
            error.response.data
          );
        } else if (error.code === 'ECONNABORTED') {
          throw new ApiError('Request timeout', 408);
        } else if (error.message === 'canceled') {
          throw new ApiError('Request canceled', 0);
        } else {
          throw new ApiError('Network error', 0);
        }
      }
    );
  }

  cancelRequest(key: string) {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
    }
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig & { cancelKey?: string }
  ): Promise<T> {
    const { cancelKey, ...axiosConfig } = config || {};

    if (cancelKey) {
      this.cancelRequest(cancelKey);
      const controller = new AbortController();
      this.abortControllers.set(cancelKey, controller);
      axiosConfig.signal = controller.signal;
    }

    try {
      const response = await this.client.get<T>(url, axiosConfig);
      return response.data;
    } finally {
      if (cancelKey) {
        this.abortControllers.delete(cancelKey);
      }
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
