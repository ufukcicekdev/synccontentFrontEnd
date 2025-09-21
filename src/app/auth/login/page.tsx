'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Script from 'next/script'

import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/hooks/useAuth'
import { API_ENDPOINTS } from '@/config/constants'

// Google Sign-In types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: string;
          }) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, options: {
            theme?: string;
            size?: string;
            width?: number;
            type?: string;
            text?: string;
          }) => void;
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;
}

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

type FormData = yup.InferType<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showGoogleSetupModal, setShowGoogleSetupModal] = useState(false)
  const router = useRouter()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    clearError()
  }, [clearError])

  // Initialize Google Sign-In when script loads
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1038778758103-rp0mum71rqf11ju1671d465skrfh7vij.apps.googleusercontent.com';
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
        
        console.log('Google Sign-In initialized on page load');
        
        // Pre-render button as backup method
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement && buttonElement.children.length === 1) {
          // Only render if it's our custom button (has 1 child - the span)
          setTimeout(() => {
            try {
              // Try rendering Google's button as additional option
              const backupContainer = document.createElement('div');
              backupContainer.style.display = 'none';
              backupContainer.id = 'google-backup-button';
              buttonElement.parentElement?.appendChild(backupContainer);
              
              window.google?.accounts.id.renderButton(backupContainer, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                text: 'signin_with'
              });
            } catch (error) {
              console.log('Could not pre-render Google button:', error);
            }
          }, 500);
        }
      }
    };

    // Try to initialize immediately if script is already loaded
    if (window.google) {
      initializeGoogleSignIn();
    }
    
    // Also listen for script load events
    window.addEventListener('google-script-loaded', initializeGoogleSignIn);
    
    return () => {
      window.removeEventListener('google-script-loaded', initializeGoogleSignIn);
    };
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await login(data)
      router.push('/dashboard')
    } catch (error) {
      // Error is handled in the store
    }
  }

  const handleGoogleLogin = () => {
    console.log('Google login button clicked');
    
    // Check if Google script is loaded
    if (typeof window === 'undefined') {
      console.error('Window is undefined');
      setShowGoogleSetupModal(true);
      return;
    }
    
    if (!window.google) {
      console.error('Google Sign-In script not loaded');
      setShowGoogleSetupModal(true);
      return;
    }
    
    if (!window.google.accounts) {
      console.error('Google accounts API not available');
      setShowGoogleSetupModal(true);
      return;
    }
    
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1038778758103-rp0mum71rqf11ju1671d465skrfh7vij.apps.googleusercontent.com";
      console.log('Initializing Google Sign-In with client ID:', clientId);
      
      // Skip prompt() entirely to avoid FedCM, go straight to button rendering
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      
      console.log('Rendering Google button directly to avoid FedCM issues');
      
      // Render Google's official button instead of using prompt
      const buttonElement = document.getElementById('google-signin-button');
      if (buttonElement) {
        // Clear existing content
        buttonElement.innerHTML = '';
        
        // Render Google's native sign-in button
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          width: buttonElement.offsetWidth,
          type: 'standard',
          text: 'signin_with'
        });
        
        console.log('Google button rendered successfully');
      }
      
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      setShowGoogleSetupModal(true);
    }
  }

  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    try {
      // Send the Google token to our backend
      const res = await fetch(API_ENDPOINTS.GOOGLE_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential
        })
      })

      if (res.ok) {
        const data = await res.json()
        
        // Store tokens
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        
        // Update auth store with user data
        useAuthStore.setState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        const errorData = await res.json()
        console.error('Google login failed:', errorData)
        alert(`Google login failed: ${errorData.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Google login error:', error)
      alert('Failed to process Google login. Please try again.')
    }
  }

  return (
    <>
     
      
      {/* Load Google Sign-In script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Google Sign-In script loaded successfully');
        }}
        onError={(error) => {
          console.error('Failed to load Google Sign-In script:', error);
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SyncContents</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/70">Sign in to your account to continue</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p className="text-red-800 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full pl-12 py-3 rounded-lg border transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                  } focus:ring-2 focus:ring-opacity-50 focus:outline-none bg-white text-gray-900 placeholder-gray-500`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                  } focus:ring-2 focus:ring-opacity-50 focus:outline-none bg-white text-gray-900 placeholder-gray-500`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>

              <Link
                href="/auth/forgot-password"
                className="text-sm text-purple-300 hover:text-purple-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-white">Or sign in with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6">
              <div 
                id="google-signin-container"
                className="w-full min-h-[48px] flex items-center justify-center"
              >
                <button
                  id="google-signin-button"
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EB4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-purple-300 hover:text-purple-200"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    
    {/* Google Setup Modal */}
    {showGoogleSetupModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Google Sign-In Setup Required
          </h3>
          <div className="space-y-4 text-sm text-gray-600">
            <p>To enable Google Sign-In, you need to configure your Google Cloud Console:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
              <li>Navigate to APIs & Services → Credentials</li>
              <li>Find your OAuth 2.0 Client ID</li>
              <li>Add <code className="bg-gray-100 px-1 rounded">http://localhost:3001</code> to &ldquo;Authorized JavaScript origins&rdquo;</li>
              <li>Save changes and try again</li>
            </ol>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
              <p className="text-blue-800 text-xs">
                <strong>FedCM Issue Solution:</strong> The error &ldquo;FedCM was disabled&rdquo; can be fixed by:
                <br />1. Click the 🔒 icon next to the URL bar in Chrome
                <br />2. Enable &ldquo;Third-party sign-in&rdquo; or &ldquo;Sign in with Google&rdquo;
                <br />3. Refresh the page and try again
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
              <p className="text-green-800 text-xs">
                <strong>Alternative:</strong> The system now automatically uses Google&apos;s button method to bypass FedCM entirely. Just click the Google sign-in button that appears.
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowGoogleSetupModal(false)}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowGoogleSetupModal(false);
                window.location.reload();
              }}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}