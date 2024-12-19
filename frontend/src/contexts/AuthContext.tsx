import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RegisterFormData } from '../pages/auth/Register';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  getCSRFToken: () => Promise<void>;
}

interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    // Set up response interceptor for handling unauthorized responses
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Clear auth state
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');

          // Redirect to login
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get<{ data: User }>('/api/user');
          setUser(response.data.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          // If we can't fetch the user, clear the auth state
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      }
    };

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      fetchUser();
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [token, navigate]);

  // CSRF Cookie initialization
  const getCSRFToken = async () => {
    try {
      await api.get('/sanctum/csrf-cookie');
      console.log('CSRF token initialized.');
    } catch (error) {
      console.error('Error initializing CSRF token:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/api/login', { email, password });
    setToken(response.data.data.token);
    setUser(response.data.data.user);
  };

  const register = async (data: RegisterFormData) => {
    const response = await api.post<AuthResponse>('/api/register', data);
    console.log(response.data.data);
    setToken(response.data.data.token);
    setUser(response.data.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated, getCSRFToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the api instance for use in other components
export { api };
