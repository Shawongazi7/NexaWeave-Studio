// Client-side auth API wrapper hitting Express backend
export interface AuthUser { id: string; email: string; name?: string | null }

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function jsonFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(BASE_URL + path, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include',
      ...options,
    });
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try { 
        const j = await res.json(); 
        msg = j.error || msg; 
      } catch (parseError) {
        console.warn('Failed to parse error response:', parseError);
      }
      const fetchError = new Error(msg);
      fetchError.name = 'FetchError';
      throw fetchError;
    }
    return res.json();
  } catch (error) {
    console.error('jsonFetch error details:', {
      error,
      errorName: error?.constructor?.name,
      errorMessage: error instanceof Error ? error.message : String(error),
      path,
      options
    });
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const connectionError = new Error('Server connection failed. Please check if the server is running.');
      connectionError.name = 'ConnectionError';
      throw connectionError;
    }
    throw error;
  }
}

export async function apiSignup(email: string, password: string, name?: string) {
  return jsonFetch<{ user: AuthUser }>("/auth/signup", { method: 'POST', body: JSON.stringify({ email, password, name }) });
}

export async function apiLogin(email: string, password: string) {
  return jsonFetch<{ token: string; user: AuthUser }>("/auth/login", { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function apiMe(token: string) {
  return jsonFetch<{ user: AuthUser }>("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
}

// Project API functions
export interface ApiProject {
  id: string;
  title: string;
  description?: string;
  content: string;
  published?: boolean;
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export async function apiGetProjects(token: string) {
  return jsonFetch<{ projects: ApiProject[] }>("/projects", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function apiCreateProject(token: string, title: string, description: string, content: any) {
  return jsonFetch<{ project: ApiProject }>("/projects", {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, description, content })
  });
}

export async function apiUpdateProject(token: string, id: string, updates: { title?: string; description?: string; content?: any; published?: boolean; publishedUrl?: string }) {
  return jsonFetch<{ project: ApiProject }>(`/projects/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates)
  });
}

export async function apiDeleteProject(token: string, id: string) {
  return jsonFetch<{}>(`/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}
