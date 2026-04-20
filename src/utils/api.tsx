// API utilities for authentication and data access
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function fetchWithAuth(url: string, options: any = {}) {
  const { token, ...restOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...restOptions,
    headers,
    credentials: 'include'
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.error || `API error: ${response.status}`;
    } catch (e) {
      errorMessage = `API error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function apiCall(endpoint: string, options: any = {}) {
  const { method = 'GET', body, token } = options;

  try {
    return fetchWithAuth(endpoint, {
      method,
      token,
      ...(body ? { body: JSON.stringify(body) } : {})
    });
  } catch (error) {
    console.error('API call error:', error);
    return Promise.reject(error);
  }
}

export const authApi = {
  signup: async (userData: { email: string; password: string; name?: string }) => {
    return apiCall('/auth/signup', { method: 'POST', body: userData });
  },
  login: async (credentials: { email: string; password: string }) => {
    return apiCall('/auth/login', { method: 'POST', body: credentials });
  },
  getUser: async (token: string) => {
    return apiCall('/auth/me', { method: 'GET', token });
  },
  createTestUser: async () => {
    return Promise.reject(new Error('Demo seed user is disabled unless ENABLE_DEMO_SEED=true on the server.'));
  }
};

export const templatesApi = {
  getAll: () => Promise.resolve({ templates: [] }),
  create: () => Promise.reject(new Error('API disabled for UI demo')),
  initDefaults: () => Promise.resolve({}),
};

export const projectsApi = {
  getAll: async (token: string) => {
    return apiCall('/projects', { method: 'GET', token });
  },
  create: async (projectData: any, token: string) => {
    return apiCall('/projects', { method: 'POST', body: projectData, token });
  },
  update: async (id: string, projectData: any, token: string) => {
    return apiCall(`/projects/${id}`, { method: 'PUT', body: projectData, token });
  },
  delete: async (id: string, token: string) => {
    return apiCall(`/projects/${id}`, { method: 'DELETE', token });
  },
  getPublished: async (id: string) => {
    return apiCall(`/projects/${id}/published`, { method: 'GET' });
  },
};
