/**
 * Typed API client for making requests from client components
 * Handles errors, authentication, and provides type-safe responses
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || data.message || 'An error occurred',
          response.status,
          data
        );
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        500
      );
    }
  }

  // Generic CRUD methods
  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // Template API methods
  templates = {
    getAll: (params?: { search?: string; categories?: string[]; tags?: string[] }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.categories) query.set('categories', params.categories.join(','));
      if (params?.tags) query.set('tags', params.tags.join(','));
      const queryString = query.toString();
      return this.get<any[]>(`/api/templates${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: string) => this.get<any>(`/api/templates/${id}`),
    create: (data: any) => this.post<any>('/api/templates', data),
    update: (id: string, data: any) => this.put<any>(`/api/templates/${id}`, data),
    delete: (id: string) => this.delete<void>(`/api/templates/${id}`),
  };

  // Snippet API methods
  snippets = {
    getAll: (params?: { language?: string; tags?: string[] }) => {
      const query = new URLSearchParams();
      if (params?.language) query.set('language', params.language);
      if (params?.tags) query.set('tags', params.tags.join(','));
      const queryString = query.toString();
      return this.get<any[]>(`/api/snippets${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: string) => this.get<any>(`/api/snippets/${id}`),
    search: (query: string) => this.get<any[]>(`/api/snippets?search=${encodeURIComponent(query)}`),
    getByCategory: (category: string) => this.get<any[]>(`/api/snippets?category=${encodeURIComponent(category)}`),
    create: (data: any) => this.post<any>('/api/snippets', data),
    update: (id: string, data: any) => this.put<any>(`/api/snippets/${id}`, data),
    delete: (id: string) => this.delete<void>(`/api/snippets/${id}`),
  };

  // Profile API methods
  profiles = {
    getAll: () => this.get<any[]>('/api/profiles'),
    getById: (id: string) => this.get<any>(`/api/profiles/${id}`),
    create: (data: any) => this.post<any>('/api/profiles', data),
    update: (id: string, data: any) => this.put<any>(`/api/profiles/${id}`, data),
    delete: (id: string) => this.delete<void>(`/api/profiles/${id}`),
  };

  // Schema API methods
  schemas = {
    getAll: () => this.get<any[]>('/api/schemas'),
    getById: (id: string) => this.get<any>(`/api/schemas/${id}`),
    create: (data: any) => this.post<any>('/api/schemas', data),
    delete: (id: string) => this.delete<void>(`/api/schemas/${id}`),
  };

  // Variable API methods
  variables = {
    getAll: () => this.get<any[]>('/api/variables'),
    getByKey: (key: string) => this.get<any>(`/api/variables/${key}`),
    create: (data: any) => this.post<any>('/api/variables', data),
    update: (key: string, data: any) => this.put<any>(`/api/variables/${key}`, data),
    delete: (key: string) => this.delete<void>(`/api/variables/${key}`),
    initialize: () => this.post<any>('/api/variables/initialize', {}),
  };
}

// Export singleton instance
export const api = new ApiClient();

// Export type for use in components
export type { ApiResponse };
