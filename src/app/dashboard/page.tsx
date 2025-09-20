'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Upload, 
  BarChart3, 
  Settings, 
  User, 
  Sparkles,
  LogOut,
  Plus,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  ExternalLink,
  Check,
  AlertCircle,
  Menu,
  X,
  BookOpen
} from 'lucide-react'

import { useAuthStore } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { OAuthErrorModal } from '@/components/ui/OAuthErrorModal'
import { AccountManagementModal } from '@/components/ui/AccountManagementModal'
import { SocialAnalytics } from '@/components/ui/SocialAnalytics'
import { API_ENDPOINTS } from '@/config/constants'

interface SocialPlatform {
  id: number
  name: string
  display_name: string
  icon_class: string
  color_class: string
  is_active: boolean
}

interface ConnectedAccount {
  id: number
  platform: SocialPlatform
  platform_username: string
  platform_display_name: string
  profile_picture_url: string
  status: string
  is_expired: boolean
  connected_at: string
}

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

export default function DashboardPage() {
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore()
  const router = useRouter()
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([])
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [oauthError, setOauthError] = useState<{platform: string, error: string} | null>(null)
  const [accountModal, setAccountModal] = useState<{platform: SocialPlatform, accounts: ConnectedAccount[]} | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else {
      fetchPlatformsAndAccounts()
    }
  }, [isAuthenticated, router])

  // Add useEffect to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      
      // On desktop (lg and up), ensure sidebar state doesn't affect layout
      if (!mobile) {
        setSidebarOpen(false) // Always close mobile sidebar on desktop
      }
    }
    
    // Set initial state and force check
    setTimeout(handleResize, 100) // Delay to ensure DOM is ready
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchPlatformsAndAccounts = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      // Fetch available platforms
      const platformsResponse = await fetch(API_ENDPOINTS.PLATFORMS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (platformsResponse.ok) {
        const platformsData = await platformsResponse.json()
        setPlatforms(platformsData)
      }

      // Fetch connected accounts
      const accountsResponse = await fetch(API_ENDPOINTS.ACCOUNTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json()
        setConnectedAccounts(accountsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectPlatform = async (platformName: string) => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.CONNECT_PLATFORM(platformName), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Redirect to OAuth authorization URL
        window.location.href = data.authorization_url
      } else {
        // Handle specific error cases
        if (data.setup_required) {
          setOauthError({
            platform: platformName,
            error: data.error
          })
        } else {
          setOauthError({
            platform: platformName,
            error: data.error || 'Unknown error occurred'
          })
        }
      }
    } catch (error) {
      console.error('Error connecting platform:', error)
      setOauthError({
        platform: platformName,
        error: 'Network error while connecting. Please try again.'
      })
    }
  }

  const handleDisconnectAccount = async (accountId: number) => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.DISCONNECT_ACCOUNT(accountId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        // Refresh connected accounts
        fetchPlatformsAndAccounts()
      }
    } catch (error) {
      console.error('Error disconnecting account:', error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const isConnected = (platformName: string) => {
    return connectedAccounts.some(account => account.platform.name === platformName)
  }

  const getConnectedAccounts = (platformName: string) => {
    return connectedAccounts.filter(account => account.platform.name === platformName)
  }

  const getConnectedAccount = (platformName: string) => {
    return connectedAccounts.find(account => account.platform.name === platformName)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Mobile Sidebar Overlay - Only show on mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:inset-0 lg:z-auto transition-transform duration-300 ease-in-out lg:transition-none lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">SyncContents</span>
              </div>
              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
              {[
                { icon: Home, label: 'Dashboard', active: true, href: '/dashboard' },
                { icon: Upload, label: 'Create Post', href: '#' },
                { icon: BarChart3, label: 'Analytics', href: '/analytics' },
                { icon: BookOpen, label: 'User Guide', href: '/user-guide' },
                { icon: Settings, label: 'Settings', href: '/settings' },
              ].map((item) => (
                item.href === '#' ? (
                  <button
                    key={item.label}
                    className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-left ${
                      item.active
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    disabled
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                  </Link>
                )
              ))
            }
            </nav>

            {/* User Profile */}
            <div className="p-3 sm:p-4 border-t">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {user.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.subscription_tier} Plan
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                icon={LogOut}
                className="w-full text-xs sm:text-sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile menu button - Only show on mobile */}
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                )}
                
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Welcome back, {user.full_name || user.email}!
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {connectedAccounts.length === 0 
                      ? 'Connect your social accounts to start managing your online presence'
                      : `Managing ${connectedAccounts.length} connected platform${connectedAccounts.length !== 1 ? 's' : ''} from one dashboard`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Social Accounts Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Connected Accounts</h2>
                <Button icon={Plus} variant="primary" className="w-full sm:w-auto">
                  Connect Account
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading platforms...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {platforms.map((platform) => {
                    const connected = isConnected(platform.name)
                    const accounts = getConnectedAccounts(platform.name)
                    const primaryAccount = accounts[0] // Show primary account in header
                    const IconComponent = platformIcons[platform.name as keyof typeof platformIcons] || User

                    return (
                      <motion.div
                        key={platform.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${platform.color_class} flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{platform.display_name}</h3>
                              {connected && primaryAccount && (
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                  {accounts.length > 1 
                                    ? `${accounts.length} accounts connected`
                                    : primaryAccount.platform_display_name || `@${primaryAccount.platform_username}`
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {connected && accounts.length > 0 ? (
                            <>
                              <div className="flex items-center space-x-2">
                                <Check className="w-5 h-5 text-green-500" />
                                {accounts.some(acc => acc.is_expired) && (
                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                )}
                              </div>
                              
                              {/* Connected Accounts Info */}
                              <div className="mt-3 sm:mt-4 space-y-2">
                                {accounts.slice(0, 2).map((account, index) => (
                                  <div key={account.id} className={`p-2 sm:p-3 rounded-lg border ${
                                    index === 0 ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                  }`}>
                                    <div className="flex items-center space-x-2 sm:space-x-3">
                                      {account.profile_picture_url ? (
                                        <img 
                                          src={account.profile_picture_url} 
                                          alt={account.platform_display_name}
                                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                        />
                                      ) : (
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white border-2 border-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                                          <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                          {account.platform_display_name || account.platform_username}
                                        </p>
                                        <p className="text-xs text-gray-600 truncate">
                                          @{account.platform_username}
                                        </p>
                                      </div>
                                      <div className="flex-shrink-0">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
                                          account.status === 'connected' ? 'bg-green-100 text-green-800' :
                                          account.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          {account.status === 'connected' ? '✓' :
                                           account.status === 'expired' ? '⚠' :
                                           '✗'}
                                        </span>
                                      </div>
                                    </div>
                                    {account.status === 'connected' && index === 0 && (
                                      <div className="mt-1 sm:mt-2 flex items-center text-xs text-green-700">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse"></div>
                                        <span className="hidden sm:inline">Primary account - Ready to create and publish content</span>
                                        <span className="sm:hidden">Primary - Ready to post</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {accounts.length > 2 && (
                                  <div className="text-xs text-gray-500 text-center py-1">
                                    +{accounts.length - 2} more account{accounts.length - 2 !== 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <ExternalLink className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        
                        
                        <div className="space-y-2 sm:space-y-3">
                          {connected && accounts.length > 0 ? (
                            <div className="space-y-2">
                              {/* Primary Action: Create Post */}
                              {accounts.some(acc => acc.status === 'connected') && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="w-full text-xs sm:text-sm"
                                  icon={Upload}
                                >
                                  Create Post
                                </Button>
                              )}
                              
                              {/* Account Management */}
                              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                <Button
                                  onClick={() => handleConnectPlatform(platform.name)}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs px-2 sm:px-3"
                                  icon={Plus}
                                >
                                  <span className="hidden sm:inline">Add Account</span>
                                  <span className="sm:hidden">Add</span>
                                </Button>
                                
                                {/* Manage dropdown for multiple accounts */}
                                <Button
                                  onClick={() => setAccountModal({platform, accounts})}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs px-2 sm:px-3"
                                >
                                  <span className="hidden sm:inline">Manage ({accounts.length})</span>
                                  <span className="sm:hidden">({accounts.length})</span>
                                </Button>
                              </div>
                              
                              {/* Show reconnect if any are expired */}
                              {accounts.some(acc => acc.is_expired) && (
                                <Button
                                  onClick={() => handleConnectPlatform(platform.name)}
                                  variant="primary"
                                  size="sm"
                                  className="w-full text-xs sm:text-sm"
                                >
                                  Reconnect Expired
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleConnectPlatform(platform.name)}
                              variant="primary"
                              size="sm"
                              className="w-full text-xs sm:text-sm"
                              icon={ExternalLink}
                            >
                              Connect {platform.display_name}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quick Actions</h2>
                {connectedAccounts.length > 0 && (
                  <div className="text-xs sm:text-sm text-gray-500">
                    {connectedAccounts.length} account{connectedAccounts.length !== 1 ? 's' : ''} connected
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      title: connectedAccounts.length > 0 ? 'Create Your Next Post' : 'Create Your First Post',
                      description: connectedAccounts.length > 0 
                        ? `Ready to publish to ${connectedAccounts.length} connected platform${connectedAccounts.length !== 1 ? 's' : ''}` 
                        : 'Start creating engaging content for your audience',
                      icon: Upload,
                      action: connectedAccounts.length > 0 ? 'Create Post' : 'Connect Account First',
                      disabled: connectedAccounts.length === 0,
                      href: '#'
                    },
                    {
                      title: 'View Analytics',
                      description: 'Monitor your social media performance',
                      icon: BarChart3,
                      action: 'View Analytics',
                      disabled: connectedAccounts.length === 0,
                      href: '/analytics'
                    },
                    {
                      title: 'Account Settings',
                      description: 'Manage your profile and preferences',
                      icon: Settings,
                      action: 'Open Settings',
                      disabled: false,
                      href: '/settings'
                    },
                  ].map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`bg-white rounded-xl shadow-sm border p-4 sm:p-6 ${
                      action.disabled ? 'opacity-50' : 'hover:shadow-md'
                    } transition-shadow`}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{action.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">{action.description}</p>
                    <Button
                      variant={action.disabled ? "outline" : "primary"}
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                      disabled={action.disabled}
                      onClick={() => {
                        if (!action.disabled && action.href !== '#') {
                          router.push(action.href)
                        }
                      }}
                    >
                      {action.action}
                    </Button>
                    {action.disabled && connectedAccounts.length === 0 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        <span className="hidden sm:inline">Connect social accounts first</span>
                        <span className="sm:hidden">Connect accounts first</span>
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Analytics Section */}
            {connectedAccounts.length > 0 && (
              <div id="analytics-section" className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Analytics Overview</h2>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Real-time data from your connected platforms
                  </div>
                </div>
                <SocialAnalytics />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* OAuth Error Modal */}
      <OAuthErrorModal
        isOpen={!!oauthError}
        onClose={() => setOauthError(null)}
        platform={oauthError?.platform || ''}
        error={oauthError?.error || ''}
      />

      {/* Account Management Modal */}
      <AccountManagementModal
        isOpen={!!accountModal}
        onClose={() => setAccountModal(null)}
        platform={accountModal?.platform ? {
          name: accountModal.platform.name,
          display_name: accountModal.platform.display_name,
          color_class: accountModal.platform.color_class
        } : { name: '', display_name: '', color_class: '' }}
        accounts={accountModal?.accounts || []}
        onDisconnect={handleDisconnectAccount}
        onReconnect={handleConnectPlatform}
        onAddAccount={handleConnectPlatform}
      />
    </div>
  )
}