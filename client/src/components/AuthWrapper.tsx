import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { Navigate } from 'react-router-dom';

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const AuthWrapper: React.FC = () => {
  const { user, loading, login, signup, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSignup, setIsSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    console.log('AuthWrapper mounted, user:', user);
  }, [user]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    // Confirm password validation for signup
    if (isSignup && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password, rememberMe);
      }
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError(null);
    setValidationErrors({});
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: resetEmail })
      });
      
      setError('Password reset link sent to your email');
      setResetEmail('');
    } catch (err) {
      setError('Failed to send reset link');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      window.location.href = `/api/auth/${provider}`;
    } catch (err) {
      setError(`${provider} login failed`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {showForgotPassword ? (
          <div className="auth-wrapper p-6 max-w-sm mx-auto">
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
              
              {error && (
                <div className="auth-error text-red-500 text-center p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                {isSignup ? 'Create Account' : 'Sign In'}
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <img src="/google-icon.svg" className="h-5 w-5 mr-2" alt="" />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <img src="/github-icon.svg" className="h-5 w-5 mr-2" alt="" />
                Continue with GitHub
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    validationErrors.email ? 'border-red-500' : ''
                  }`}
                  required
                />
              </label>
              {validationErrors.email && (
                <p className="text-red-500 text-xs italic">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    validationErrors.password ? 'border-red-500' : ''
                  }`}
                  required
                />
              </label>
              {password && <PasswordStrengthIndicator password={password} />}
              {validationErrors.password && (
                <p className="text-red-500 text-xs italic">{validationErrors.password}</p>
              )}
            </div>

            {isSignup && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password:
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      validationErrors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    required
                  />
                </label>
                {validationErrors.confirmPassword && (
                  <p className="text-red-500 text-xs italic">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
              >
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="button"
              onClick={toggleMode}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 transition duration-200"
            >
              {isSignup ? 'Already have an account?' : 'Need an account?'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}; 