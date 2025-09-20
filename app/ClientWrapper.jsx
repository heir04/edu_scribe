'use client';
import { AuthProvider } from './components/AuthContext';

export default function ClientWrapper({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}