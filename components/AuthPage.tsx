import React, { useState } from 'react';
import type { Page } from '../App';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  AuthError 
} from 'firebase/auth';

interface AuthPageProps {
  setPage: (page: Page) => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

const AuthPage: React.FC<AuthPageProps> = ({ setPage }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): string => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return 'strong';
    }
    return 'medium';
  };

  const handleAuthError = (err: unknown) => {
    const error = err as AuthError;
    setLoading(false);
    switch (error.code) {
      case 'auth/email-already-in-use':
        setError('An account with this email already exists.');
        break;
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        setError('Invalid email or password. Please try again.');
        break;
      case 'auth/weak-password':
        setError('Password should be at least 6 characters.');
        break;
      case 'auth/too-many-requests':
        setError('Too many failed attempts. Please try again later.');
        break;
      case 'auth/popup-closed-by-user':
        setError('Sign-in was cancelled. Please try again.');
        break;
      default:
        setError('An unexpected error occurred. Please try again.');
        console.error(error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset email sent! Check your inbox.');
        setLoading(false);
        return;
      }

      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name.trim() });
      }
      setPage('dashboard');
    } catch (err) {
      handleAuthError(err);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setPage('dashboard');
    } catch (err) {
      handleAuthError(err);
    }
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  };

  const passwordStrength = mode === 'signup' && password ? getPasswordStrength(password) : null;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/25 dark:bg-gray-800/25 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/40 dark:border-white/10">
        <h2 className="text-3xl font-bold text-center mb-2 text-text-primary dark:text-text-primary-dark">
          {mode === 'login' && 'Welcome Back'}
          {mode === 'signup' && 'Join the Network'}
          {mode === 'reset' && 'Reset Password'}
        </h2>
        <p className="text-center text-text-secondary dark:text-text-secondary-dark mb-8">
          {mode === 'login' && 'Log in to continue.'}
          {mode === 'signup' && 'Create an account to get started.'}
          {mode === 'reset' && 'Enter your email to receive a reset link.'}
        </p>

        {mode !== 'reset' && (
          <>
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              aria-label="Sign in with Google"
              className="w-full flex justify-center items-center space-x-2 bg-white/50 dark:bg-gray-700/50 text-text-secondary dark:text-text-secondary-dark font-semibold py-3 px-4 rounded-lg border border-gray-300/50 dark:border-white/10 shadow-sm hover:bg-white/80 dark:hover:bg-gray-600/50 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.81C34.553 5.822 29.587 3.5 24 3.5C11.983 3.5 2.5 12.983 2.5 25s9.483 21.5 21.5 21.5c11.983 0 21.5-9.483 21.5-21.5c0-1.455-.122-2.87-.36-4.242z"></path>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300/40 dark:border-white/10"></div>
              <span className="flex-shrink mx-4 text-sm text-text-secondary dark:text-text-secondary-dark">OR</span>
              <div className="flex-grow border-t border-gray-300/40 dark:border-white/10"></div>
            </div>
          </>
        )}

        {error && (
          <div className="mb-4 text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-center text-green-600 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">
                Full Name
              </label>
              <input 
                id="name"
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
                autoComplete="name"
                className="mt-1 block w-full p-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              className="mt-1 block w-full p-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>
          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-text-primary-dark">
                Password
              </label>
              <div className="relative mt-1">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="block w-full p-3 pr-10 bg-white/50 dark:bg-gray-700/50 border border-gray-300/40 dark:border-white/10 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  </div>
                  <p className="text-xs mt-1 text-text-secondary dark:text-text-secondary-dark">
                    Password strength: <span className="font-semibold capitalize">{passwordStrength}</span>
                  </p>
                </div>
              )}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center items-center bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-xl hover:shadow-primary/40 dark:hover:shadow-accent/40 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Processing...' : mode === 'login' ? 'Log In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === 'login' && (
            <button 
              onClick={() => toggleMode('reset')} 
              disabled={loading} 
              className="block w-full text-sm font-medium text-accent hover:text-primary dark:hover:text-white transition-colors disabled:opacity-50"
            >
              Forgot your password?
            </button>
          )}
          <button 
            onClick={() => toggleMode(mode === 'login' ? 'signup' : 'login')} 
            disabled={loading} 
            className="block w-full text-sm font-medium text-accent hover:text-primary dark:hover:text-white transition-colors disabled:opacity-50"
          >
            {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
          </button>
          {mode === 'reset' && (
            <button 
              onClick={() => toggleMode('login')} 
              disabled={loading} 
              className="block w-full text-sm font-medium text-accent hover:text-primary dark:hover:text-white transition-colors disabled:opacity-50"
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;