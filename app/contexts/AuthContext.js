'use client';
import { createContext, useContext, useState, useEffect } from 'react';
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
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Base API URL
  const API_BASE_URL = 'https://api.eduscribe.com/api';

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const userData = decodeToken(storedToken);
      if (userData && userData.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(userData);
      } else {
        // Token expired
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        const userData = decodeToken(data.token);
        
        setToken(data.token);
        setUser(userData);
        localStorage.setItem('token', data.token);
        
        // Redirect based on user role
        if (userData.role === '0') { // Teacher
          router.push('/teacher/dashboard');
        } else { // Student
          router.push('/student/dashboard');
        }
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const registerTeacher = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/User/RegisterTeacher`, {
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
      const response = await fetch(`${API_BASE_URL}/User/RegisterStudent`, {
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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  // API helper function with automatic token inclusion
  const apiCall = async (endpoint, options = {}) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Token expired or invalid
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
    isTeacher: user?.role === '0',
    isStudent: user?.role === '1',
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};