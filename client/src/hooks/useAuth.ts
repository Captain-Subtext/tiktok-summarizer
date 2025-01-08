import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        console.log('Token:', token); // Debug log

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Session response:', response.status); // Debug log

        if (response.ok) {
          const { user } = await response.json();
          console.log('User data:', user); // Debug log
          setUser(user);
        } else {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: AuthResponse = await response.json();
      if (response.ok) {
        setUser(data.user);
        if (rememberMe) {
          localStorage.setItem('token', data.token);
        } else {
          sessionStorage.setItem('token', data.token);
        }
        return data.user;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: AuthResponse = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return data.user;
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return {
    user,
    loading,
    login,
    signup,
    logout
  };
} 