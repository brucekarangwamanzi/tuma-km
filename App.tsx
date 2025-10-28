import React, { useState, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Role, User } from './types';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
// Import environment logger to display config in console
import './utils/envLogger';

// Backend API base URL
const API_BASE_URL = 'http://localhost:3002/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  signup: (fullName: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  signInWithGoogle: (googleUser: { id: string; email: string; name: string; picture?: string }) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Login failed' };
      }

      // Convert backend user to app user format
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        phone: data.user.phone || '',
        role: data.user.role as Role,
        isVerified: data.user.isVerified,
        createdAt: data.user.createdAt,
        totalOrders: data.user.totalOrders
      };

      setUser(user);
      navigate('/dashboard');
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };
  
  const signup = async (fullName: string, email: string, phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }

      // Convert backend user to app user format
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        phone: data.user.phone || '',
        role: data.user.role as Role,
        isVerified: data.user.isVerified,
        createdAt: data.user.createdAt,
        totalOrders: data.user.totalOrders
      };

      setUser(user);
      navigate('/dashboard');
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during registration. Please try again.' };
    }
  };

  const signInWithGoogle = async (googleUser: { id: string; email: string; name: string; picture?: string }): Promise<{ success: boolean; message: string }> => {
    try {
      // For now, use the same register endpoint with a special password
      // In a real implementation, you'd have a separate Google OAuth endpoint
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: googleUser.name,
          email: googleUser.email,
          phone: '',
          password: 'google-oauth-' + googleUser.id // Special password for Google users
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If user already exists, try to login instead
        if (data.message && data.message.includes('already exists')) {
          const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: googleUser.email,
              password: 'google-oauth-' + googleUser.id
            }),
          });

          const loginData = await loginResponse.json();

          if (!loginResponse.ok) {
            return { success: false, message: 'Failed to sign in with Google. Please try again.' };
          }

          const user: User = {
            id: loginData.user.id,
            email: loginData.user.email,
            fullName: loginData.user.fullName,
            phone: loginData.user.phone || '',
            role: loginData.user.role as Role,
            isVerified: true, // Google accounts are considered verified
            createdAt: loginData.user.createdAt,
            totalOrders: loginData.user.totalOrders
          };

          setUser(user);
          navigate('/dashboard');
          return { success: true, message: 'Successfully signed in with Google!' };
        }
        return { success: false, message: data.message || 'Failed to sign in with Google' };
      }

      // Convert backend user to app user format
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        phone: data.user.phone || '',
        role: data.user.role as Role,
        isVerified: true, // Google accounts are considered verified
        createdAt: data.user.createdAt,
        totalOrders: data.user.totalOrders
      };

      setUser(user);
      navigate('/dashboard');
      return { success: true, message: 'Account created successfully with Google!' };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, message: 'Failed to sign in with Google. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

const AppRoutes: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={user ? <DashboardPage user={user} onLogout={logout} /> : <Navigate to="/login" replace />} />
            <Route path="/" element={!user ? <HomePage /> : <Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;