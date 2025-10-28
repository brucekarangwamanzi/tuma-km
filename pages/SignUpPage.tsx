import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import PasswordInput from '../components/PasswordInput';
import GoogleSignInButton from '../components/GoogleSignInButton';
import AuthDemo from '../components/AuthDemo';
import EnvDisplay from '../components/EnvDisplay';
import GoogleAccountInfo from '../components/GoogleAccountInfo';
import { GoogleUser } from '../services/googleAuthService';

const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const result = await signup(fullName.trim(), email.trim(), phone.trim(), password);
        if (!result.success) {
          setErrors({ general: result.message });
        }
      } catch (error) {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSuccess = async (googleUser: GoogleUser) => {
    setErrors({});
    try {
      const result = await signInWithGoogle({
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture
      });
      
      if (!result.success) {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Failed to sign up with Google. Please try again.' });
    }
  };

  const handleGoogleError = (errorMessage: string) => {
    setErrors({ general: errorMessage });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-4">
        <EnvDisplay />
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2 text-center">Tuma-Africa Link Cargo</h1>
        <h3 className="text-2xl font-bold mb-6 text-center text-white">Create an Account</h3>
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName-signup" className="sr-only">Full Name</label>
            <input
              id="fullName-signup"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
              className={`w-full p-3 bg-gray-700 rounded border ${errors.fullName ? 'border-red-500' : 'border-gray-600'} focus:ring-cyan-500 focus:border-cyan-500 text-white`}
            />
            {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="email-signup" className="sr-only">Email</label>
            <input
              id="email-signup"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className={`w-full p-3 bg-gray-700 rounded border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:ring-cyan-500 focus:border-cyan-500 text-white`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
           <div>
            <label htmlFor="phone-signup" className="sr-only">Phone Number</label>
            <input
              id="phone-signup"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              className={`w-full p-3 bg-gray-700 rounded border ${errors.phone ? 'border-red-500' : 'border-gray-600'} focus:ring-cyan-500 focus:border-cyan-500 text-white`}
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="password-signup" className="sr-only">Password</label>
            <PasswordInput
              id="password-signup"
              value={password}
              onChange={setPassword}
              placeholder="Password (min. 8 characters)"
              required
              hasError={!!errors.password}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            <PasswordStrengthIndicator password={password} />
          </div>
          <div>
            <label htmlFor="confirmPassword-signup" className="sr-only">Confirm Password</label>
            <PasswordInput
              id="confirmPassword-signup"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
              required
              hasError={!!errors.confirmPassword}
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-800 px-2 text-gray-400">Or sign up with</span>
          </div>
        </div>

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signup"
          disabled={isLoading}
        />

        <AuthDemo />

        <GoogleAccountInfo />

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account? <Link to="/login" className="font-medium text-cyan-400 hover:underline">Log in</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;