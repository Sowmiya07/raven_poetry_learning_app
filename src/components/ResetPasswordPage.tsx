import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Logo from './Logo';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setChecking(true);
      setError(null);
      
      // Parse URL parameters from both hash and query string
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const urlParams = new URLSearchParams(window.location.search);
      
      const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
      const type = urlParams.get('type') || hashParams.get('type');
      
      console.log('Recovery tokens found:', { 
        accessToken: !!accessToken, 
        refreshToken: !!refreshToken, 
        type
      });

      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            if (error.message.includes('expired') || error.message.includes('invalid')) {
              setError('This password reset link has expired. Please request a new password reset.');
            } else {
              setError(`Authentication error: ${error.message}`);
            }
          } else if (data.session) {
            setValidSession(true);
            // Clean up URL hash after successful session but keep the path
            if (window.location.hash) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            setError('Unable to establish reset session. Please request a new password reset.');
          }
        } catch (err) {
          console.error('Session error:', err);
          setError('Network error. Please check your connection and try again.');
        }
      } else if (accessToken || refreshToken) {
        console.log('Incomplete recovery data:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        setError('Incomplete reset link data. Please request a new password reset.');
      } else {
        // Check if there's already an active session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setValidSession(true);
          } else {
            setError('No active reset session found. Please use the link from your email.');
          }
        } catch (err) {
          setError('Unable to verify session. Please request a new password reset.');
        }
      }
      
      setChecking(false);
    };

    checkSession();
  }, []);

  const requestNewReset = () => {
    // Redirect to main app where user can request new reset
    window.location.href = '/?request-reset=true';
  };

  useEffect(() => {
    // Clean up URL if we have a valid session
    if (validSession) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [validSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        if (error.message.includes('session')) {
          setError('Your reset session has expired. Please request a new password reset.');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess(true);
        // Redirect to main app after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <Logo className="w-16 h-16 mx-auto mb-6" />
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Password Updated!</h2>
          <p className="text-slate-600 mb-4">
            Your password has been successfully updated. You will be redirected to the app shortly.
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Logo className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Your Password</h2>
          <p className="text-slate-600">
            {checking ? 'Verifying reset link...' : 'Enter your new password below'}
          </p>
        </div>

        {checking ? (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Verifying your reset link...</p>
          </div>
        ) : !validSession ? (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <a
              href="/"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Back to App
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Back to App
          </a>
        </div>
      </div>
    </div>
  );
}