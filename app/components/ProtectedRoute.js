'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        router.push('/login');
        return;
      }

      if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
        console.log(`Role mismatch. Required: ${requiredRole}, User: ${user?.role}`);
        // Redirect to appropriate dashboard based on user role
        if (user?.role?.toLowerCase() === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (user?.role === '1' || user?.role?.toLowerCase() === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/login');
        }
        return;
      }
    }
  }, [user, loading, isAuthenticated, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return null; // Will redirect to appropriate dashboard
  }

  return children;
}

// Higher-order component for wrapping pages with authentication
export const withAuth = (WrappedComponent, requiredRole = null) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};