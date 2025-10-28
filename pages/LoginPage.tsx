import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import PasswordInput from '../components/PasswordInput';
import GoogleSignInButton from '../components/GoogleSignInButton';
import AuthDemo from '../components/AuthDemo';
import EnvDisplay from '../components/EnvDisplay';
import GoogleAuthTest from '../components/GoogleAuthTest';
import GeminiApiTest from '../components/GeminiApiTest';
import GoogleAccountInfo from '../components/GoogleAccountInfo';
import TestAccountsDisplay from '../components/TestAccountsDisplay';
import { GoogleUser } from '../services/googleAuthService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleUser: GoogleUser) => {
    setError('');
    try {
      const result = await signInWithGoogle({
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture
      });
      
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-4">
        <EnvDisplay />
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2 text-center">Tuma-Africa Link Cargo</h1>
        <h3 className="text-2xl font-bold mb-6 text-center text-white">Welcome Back</h3>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              required
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 text-white" 
            />
          </div>
          <div>
            <label htmlFor="password-login" className="sr-only">Password</label>
            <PasswordInput
              id="password-login"
              value={password}
              onChange={setPassword}
              placeholder="Password"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signin"
          disabled={isLoading}
        />

        <AuthDemo />

        <GoogleAccountInfo />

        <GoogleAuthTest />

        <GeminiApiTest />

        <TestAccountsDisplay />

        <p className="text-sm text-gray-400 mt-6 text-center">
          Don't have an account? <Link to="/signup" className="font-medium text-cyan-400 hover:underline">Sign up</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;