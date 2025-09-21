'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Decode JWT token to extract user info
const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.jti || payload.sub,
        email: payload.sub,
        role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Use proxy endpoints instead of direct HTTP calls to avoid mixed content errors
  const API_BASE_URL = '/api';

  // Logout function - wrapped in useCallback to prevent infinite loops
  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [router]);

  // Check and refresh token
  const checkTokenValidity = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    if (isTokenExpired(storedToken)) {
      console.log('Token expired, logging out');
      logout();
      return;
    }

    const userData = decodeToken(storedToken);
    if (userData) {
      setToken(storedToken);
      setUser(userData);
    } else {
      logout();
    }
  }, [logout]);

  // Initialize auth state
  useEffect(() => {
    checkTokenValidity();
    setLoading(false);
    setIsInitialized(true);
  }, [checkTokenValidity]);

  // Check token validity periodically and on focus
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(checkTokenValidity, 60000); // Check every minute

    const handleFocus = () => checkTokenValidity();
    const handleStorage = (e) => {
      if (e.key === 'token') {
        checkTokenValidity();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('storage', handleStorage);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('storage', handleStorage);
      }
    };
  }, [isInitialized, checkTokenValidity]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const userData = decodeToken(data.token);
        
        if (userData && !isTokenExpired(data.token)) {
          setToken(data.token);
          setUser(userData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
          }
          
          // Redirect based on user role
          if (userData.role.toLowerCase() === 'teacher') {
            router.push('/teacher/dashboard');
          } else {
            router.push('/student/dashboard');
          }
          
          return { success: true };
        } else {
          return { 
            success: false, 
            message: 'Invalid or expired token received' 
          };
        }
      } else {
        return { 
          success: false, 
          message: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const registerTeacher = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register-teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const registerStudent = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        return { success: true, message: data.message };
      } else {
        return { 
          success: false, 
          message: data.message || 'Registration failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  // API helper function with automatic token inclusion
  const apiCall = async (endpoint, options = {}) => {
    // Check token validity before making API call
    if (token && isTokenExpired(token)) {
      logout();
      return null;
    }

    // Check if body is FormData to avoid setting Content-Type header
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: {
        // Only set Content-Type if it's not FormData
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/proxy${endpoint}`, config);
      
      if (response.status === 401) {
        // Token expired or invalid
        console.log('API call returned 401, logging out');
        logout();
        return null;
      }

      const data = await response.json();
      return { response, data };
    } catch (error) {
      console.error('API call error:', error);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    registerTeacher,
    registerStudent,
    apiCall,
    isTeacher: user?.role.toLowerCase() === 'teacher',
    isStudent: user?.role === '1' || user?.role.toLowerCase() === 'student',
    isAuthenticated: !!user && !!token && !isTokenExpired(token),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};