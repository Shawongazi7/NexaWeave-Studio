// Disabled auth hook - no authentication required for UI demo
export function useAuth() {
  return {
    user: null,
    session: null,
    loading: false,
    signUp: async () => ({ data: null, error: { message: 'Authentication disabled' } }),
    signIn: async () => ({ data: null, error: { message: 'Authentication disabled' } }),
    signOut: async () => ({ error: null }),
    getAccessToken: () => null,
  };
}