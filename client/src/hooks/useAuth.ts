export function useAuth() {
  return {
    user: null,
    loading: false,
    login: () => {},
    signup: () => {},
    logout: () => {}
  };
} 