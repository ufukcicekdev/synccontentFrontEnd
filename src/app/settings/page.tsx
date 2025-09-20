'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import React from 'react'
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  CreditCard, 
  Trash2, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Zap,
  Key,
  Copy,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { NotificationModal } from '@/components/ui/NotificationModal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { API_ENDPOINTS } from '@/config/constants'

interface UserProfile {
  full_name: string
  email: string
  subscription_tier: string
  created_at: string
}

interface NotificationSettings {
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  post_reminders: boolean
}

interface ApiToken {
  id: number
  name: string
  token: string
  created_at: string
  last_used: string | null
  is_active: boolean
}

export default function SettingsPage() {
  const { user, isAuthenticated, logout, checkAuth, isLoading } = useAuthStore()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    subscription_tier: 'starter',
    created_at: ''
  })
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
    post_reminders: true
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([])
  const [newTokenName, setNewTokenName] = useState('')
  const [showTokenValue, setShowTokenValue] = useState<{[key: number]: boolean}>({})
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    showCopyButton?: boolean
    copyText?: string
  }>({ isOpen: false, title: '', message: '', type: 'info' })
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'danger' | 'warning' | 'info' | 'success'
    confirmText: string
    onConfirm: () => void
  }>({ isOpen: false, title: '', message: '', type: 'danger', confirmText: 'Confirm', onConfirm: () => {} })

  useEffect(() => {
    // Only check auth if not already authenticated
    if (!isAuthenticated && !isLoading) {
      checkAuth()
    }
  }, [isAuthenticated, isLoading, checkAuth])

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated (not loading)
    if (!isLoading && isAuthenticated === false) {
      router.push('/auth/login')
    } else if (isAuthenticated && user) {
      setUserProfile({
        full_name: user.full_name || '',
        email: user.email || '',
        subscription_tier: user.subscription_tier || 'starter',
        created_at: new Date().toISOString() // Default to current date since created_at not available
      })
      
      // Load API tokens
      fetchApiTokens()
    }
  }, [isAuthenticated, user, router, isLoading])

  const fetchApiTokens = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.TOKENS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Handle both paginated and non-paginated responses
        const tokensArray = data.results ? data.results : (Array.isArray(data) ? data : [])
        setApiTokens(tokensArray)
        console.log('Fetched tokens:', tokensArray) // Debug log
      } else {
        console.error('Failed to fetch API tokens:', response.status)
        setApiTokens([])
      }
    } catch (error) {
      console.error('Error fetching API tokens:', error)
      setApiTokens([])
    }
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.USER, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: userProfile.full_name,
        }),
      })

      if (response.ok) {
        setNotificationModal({
          isOpen: true,
          title: 'Profile Updated Successfully!',
          message: 'Your profile information has been updated.',
          type: 'success'
        })
        checkAuth() // Refresh user data
      } else {
        setNotificationModal({
          isOpen: true,
          title: 'Failed to Update Profile',
          message: 'There was an error updating your profile. Please try again.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setNotificationModal({
        isOpen: true,
        title: 'Network Error',
        message: 'A network error occurred while updating your profile. Please check your connection and try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setNotificationModal({
        isOpen: true,
        title: 'Passwords Do Not Match',
        message: 'The new password and confirmation password do not match. Please enter them again.',
        type: 'warning'
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      })

      if (response.ok) {
        setNotificationModal({
          isOpen: true,
          title: 'Password Changed Successfully!',
          message: 'Your password has been updated. Please use your new password for future logins.',
          type: 'success'
        })
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
      } else {
        const data = await response.json()
        setNotificationModal({
          isOpen: true,
          title: 'Failed to Change Password',
          message: data.error || 'There was an error changing your password. Please check your current password and try again.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setNotificationModal({
        isOpen: true,
        title: 'Network Error',
        message: 'A network error occurred while changing your password. Please try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAccountDeletion = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      type: 'danger',
      confirmText: 'Delete Account',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        await performAccountDeletion()
      }
    })
  }

  const performAccountDeletion = async () => {

    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.DELETE_ACCOUNT, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setNotificationModal({
          isOpen: true,
          title: 'Account Deleted Successfully',
          message: 'Your account has been permanently deleted. You will be redirected to the home page.',
          type: 'success'
        })
        logout()
        router.push('/')
      } else {
        setNotificationModal({
          isOpen: true,
          title: 'Failed to Delete Account',
          message: 'There was an error deleting your account. Please try again or contact support.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      setNotificationModal({
        isOpen: true,
        title: 'Network Error',
        message: 'A network error occurred while deleting your account. Please try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const generateApiToken = async () => {
    if (!newTokenName.trim()) {
      setNotificationModal({
        isOpen: true,
        title: 'Token Name Required',
        message: 'Please enter a descriptive name for your API token before generating it.',
        type: 'warning'
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.TOKENS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTokenName.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Refresh the token list from server to ensure it's up to date
        await fetchApiTokens()
        setNewTokenName('')
        setNotificationModal({
          isOpen: true,
          title: 'Token Generated Successfully!',
          message: 'Your API token has been created. Copy it now as it won\'t be shown again for security reasons.',
          type: 'success',
          showCopyButton: true,
          copyText: data.token
        })
      } else {
        setNotificationModal({
          isOpen: true,
          title: 'Failed to Generate Token',
          message: 'There was an error generating your API token. Please try again.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error generating token:', error)
      setNotificationModal({
        isOpen: true,
        title: 'Network Error',
        message: 'A network error occurred while generating the token. Please check your connection and try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const revokeApiToken = async (tokenId: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Revoke API Token',
      message: 'Are you sure you want to revoke this token? This action cannot be undone and the token will no longer work in your n8n workflows.',
      type: 'danger',
      confirmText: 'Revoke Token',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        await performTokenRevocation(tokenId)
      }
    })
  }

  const performTokenRevocation = async (tokenId: number) => {
    const confirmed = true

    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.TOKEN_DETAIL(tokenId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Refresh the token list from server to ensure it's up to date
        await fetchApiTokens()
        setNotificationModal({
          isOpen: true,
          title: 'Token Revoked Successfully',
          message: 'The API token has been permanently revoked and can no longer be used.',
          type: 'success'
        })
      } else {
        setNotificationModal({
          isOpen: true,
          title: 'Failed to Revoke Token',
          message: 'There was an error revoking the token. Please try again.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error revoking token:', error)
      setNotificationModal({
        isOpen: true,
        title: 'Network Error',
        message: 'A network error occurred while revoking the token. Please try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setNotificationModal({
      isOpen: true,
      title: 'Token Copied!',
      message: 'The API token has been copied to your clipboard. You can now paste it in your n8n workflow.',
      type: 'success'
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'api-tokens', label: 'API Tokens', icon: Key },
  ]

  const subscriptionTiers = {
    starter: { name: 'Starter', icon: Sparkles, color: 'text-blue-600' },
    professional: { name: 'Professional', icon: Crown, color: 'text-purple-600' },
    enterprise: { name: 'Enterprise', icon: Zap, color: 'text-orange-600' }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userProfile.full_name}
                        onChange={(e) => setUserProfile({ ...userProfile, full_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userProfile.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <input
                        type="text"
                        value={userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'Unknown'}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={loading || !passwordData.current_password || !passwordData.new_password}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <Shield className="w-5 h-5" />
                      <span>{loading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {key.replace(/_/g, ' ')}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {key === 'email_notifications' && 'Receive notifications via email'}
                            {key === 'push_notifications' && 'Receive push notifications in browser'}
                            {key === 'marketing_emails' && 'Receive marketing and promotional emails'}
                            {key === 'post_reminders' && 'Receive reminders about scheduled posts'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [key]: !value })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}

                    <button
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Plan</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        {React.createElement(subscriptionTiers[userProfile.subscription_tier as keyof typeof subscriptionTiers].icon, {
                          className: `w-8 h-8 ${subscriptionTiers[userProfile.subscription_tier as keyof typeof subscriptionTiers].color}`
                        })}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {subscriptionTiers[userProfile.subscription_tier as keyof typeof subscriptionTiers].name} Plan
                          </h3>
                          <p className="text-gray-500">Your current subscription</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        {userProfile.subscription_tier === 'starter' && (
                          <>
                            <p>• Connect up to 3 social accounts</p>
                            <p>• Schedule up to 30 posts per month</p>
                            <p>• Basic analytics</p>
                          </>
                        )}
                        {userProfile.subscription_tier === 'professional' && (
                          <>
                            <p>• Connect up to 10 social accounts</p>
                            <p>• Schedule unlimited posts</p>
                            <p>• Advanced analytics</p>
                            <p>• AI content suggestions</p>
                          </>
                        )}
                        {userProfile.subscription_tier === 'enterprise' && (
                          <>
                            <p>• Unlimited social accounts</p>
                            <p>• Unlimited posts</p>
                            <p>• Advanced analytics & reporting</p>
                            <p>• AI content generation</p>
                            <p>• Priority support</p>
                          </>
                        )}
                      </div>
                    </div>

                    {userProfile.subscription_tier !== 'enterprise' && (
                      <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all">
                        Upgrade Plan
                      </button>
                    )}

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                      <button
                        onClick={handleAccountDeletion}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>{loading ? 'Deleting...' : 'Delete Account'}</span>
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* API Tokens Tab */}
              {activeTab === 'api-tokens' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">API Tokens</h2>
                      <p className="text-gray-600 mt-1">Generate tokens for n8n integration and automation</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={fetchApiTokens}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-medium"
                        title="Refresh tokens"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                      </button>
                      <button
                        onClick={() => router.push('/user-guide')}
                        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View User Guide</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Generate New Token */}
                  <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Generate New Token</h3>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newTokenName}
                        onChange={(e) => setNewTokenName(e.target.value)}
                        placeholder="Token name (e.g., n8n-workflow-1)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                      <button
                        onClick={generateApiToken}
                        disabled={loading || !newTokenName.trim()}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        <span>{loading ? 'Generating...' : 'Generate'}</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      💡 Give your token a descriptive name to identify its purpose later.
                    </p>
                  </div>

                  {/* Existing Tokens */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Your API Tokens</h3>
                    {!Array.isArray(apiTokens) || apiTokens.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Key className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No API tokens yet</p>
                        <p className="text-sm">Generate your first token to start using the API</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {apiTokens.map((token) => (
                          <div key={token.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{token.name}</h4>
                                <p className="text-sm text-gray-500">
                                  Created: {new Date(token.created_at).toLocaleDateString()}
                                  {token.last_used && (
                                    <span className="ml-2">• Last used: {new Date(token.last_used).toLocaleDateString()}</span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  token.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {token.is_active ? 'Active' : 'Revoked'}
                                </span>
                                {token.is_active && (
                                  <button
                                    onClick={() => revokeApiToken(token.id)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                    title="Revoke token"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Token Value */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <code className="text-sm font-mono text-gray-900">
                                  {showTokenValue[token.id] ? token.token : '••••••••••••••••••••••••••••••••'}
                                </code>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setShowTokenValue(prev => ({
                                      ...prev,
                                      [token.id]: !prev[token.id]
                                    }))}
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                    title={showTokenValue[token.id] ? 'Hide token' : 'Show token'}
                                  >
                                    {showTokenValue[token.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(token.token)}
                                    className="text-gray-500 hover:text-gray-700 p-1"
                                    title="Copy token"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Use this token in your n8n workflows to authenticate API requests
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* API Usage Information */}
                  <div className="mt-8 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📖 How to use API tokens</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Use tokens in n8n HTTP Request nodes as Bearer authentication</p>
                      <p>• API Base URL: <code className="bg-blue-100 px-1 rounded">{API_ENDPOINTS.SOCIAL_POST.replace('/social/post/', '')}/api</code></p>
                      <p>• Include token in Authorization header: <code className="bg-blue-100 px-1 rounded">Bearer YOUR_TOKEN</code></p>
                      <p>• Check the User Guide for complete integration examples</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
        showCopyButton={notificationModal.showCopyButton}
        copyText={notificationModal.copyText}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        isLoading={loading}
      />
    </div>
  )
}