'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowLeft, User, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/hooks/useAuth'

const schema = yup.object({
  full_name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  password_confirm: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  subscription_tier: yup.string().oneOf(['starter', 'professional', 'agency']).default('starter'),
  agree_terms: yup.boolean().required('You must agree to the terms and conditions').oneOf([true], 'You must agree to the terms and conditions'),
})

type FormData = yup.InferType<typeof schema>

const subscriptionTiers = [
  {
    id: 'starter' as const,
    name: 'Starter',
    price: '$9',
    description: 'Perfect for individuals',
    features: ['3 social platforms', 'Basic analytics', 'AI captions', '1GB storage']
  },
  {
    id: 'professional' as const,
    name: 'Professional',
    price: '$19',
    description: 'Best for creators',
    features: ['All 5 platforms', 'Advanced analytics', 'AI features', '10GB storage'],
    popular: true
  },
  {
    id: 'agency' as const,
    name: 'Agency',
    price: '$49',
    description: 'For agencies',
    features: ['Unlimited accounts', 'White-label', 'Team collaboration', '100GB storage']
  }
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'starter' | 'professional' | 'agency'>('professional')
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError, isAuthenticated } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      subscription_tier: 'professional'
    }
  })

  const watchedTier = watch('subscription_tier')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    setValue('subscription_tier', selectedTier as 'starter' | 'professional' | 'agency')
  }, [selectedTier, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data)
      router.push('/dashboard')
    } catch (error) {
      // Error is handled in the store
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SyncContents</span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">Start Your Journey</h2>
          <p className="text-xl text-white/70">Join thousands of creators already using SyncContents</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Subscription Tiers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h3>
            <div className="space-y-4">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all ${
                    selectedTier === tier.id
                      ? 'border-purple-500 ring-2 ring-purple-500/50'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xl font-semibold text-white">{tier.name}</h4>
                      <p className="text-white/70">{tier.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{tier.price}</div>
                      <div className="text-white/60 text-sm">/month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-white/80 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {selectedTier === tier.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Create Account</h3>
            
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

              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full pl-12 py-3 rounded-lg border transition-all duration-200 ${
                      errors.full_name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    } focus:ring-2 focus:ring-opacity-50 focus:outline-none bg-white text-gray-900 placeholder-gray-500`}
                    {...register('full_name')}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-sm text-red-400">{errors.full_name.message}</p>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
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
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 ${
                      errors.password_confirm 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    } focus:ring-2 focus:ring-opacity-50 focus:outline-none bg-white text-gray-900 placeholder-gray-500`}
                    {...register('password_confirm')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password_confirm && (
                  <p className="text-sm text-red-400">{errors.password_confirm.message}</p>
                )}
              </div>

              {/* Hidden subscription tier field */}
              <input type="hidden" {...register('subscription_tier')} />

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agree_terms"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    {...register('agree_terms')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agree_terms" className="text-white">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-300 hover:text-purple-200">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-300 hover:text-purple-200">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agree_terms && (
                    <p className="text-red-400 text-xs mt-1">{errors.agree_terms.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-purple-300 hover:text-purple-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}