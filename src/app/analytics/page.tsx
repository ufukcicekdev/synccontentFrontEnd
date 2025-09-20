'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Users, 
  VideoIcon, 
  Eye, 
  TrendingUp, 
  RefreshCw, 
  Calendar,
  BarChart3,
  Activity,
  ExternalLink,
  Sparkles,
  Filter,
  Download
} from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuth'
import { API_ENDPOINTS } from '@/config/constants'

interface AnalyticsData {
  id: number
  account_id: number
  platform_name: string
  platform_display_name: string
  platform_username: string
  subscriber_count?: number
  video_count?: number
  view_count?: number
  follower_count?: number
  media_count?: number
  last_updated: string
}

interface ConnectedAccount {
  id: number
  platform: {
    name: string
    display_name: string
    color_class: string
  }
  platform_username: string
  platform_display_name: string
  status: string
}

export default function AnalyticsPage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState<number | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    fetchAnalyticsData()
    fetchConnectedAccounts()
  }, [isAuthenticated])

  const fetchConnectedAccounts = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.ACCOUNTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConnectedAccounts(data)
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error)
    }
  }

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.ANALYTICS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshAnalytics = async (accountId: number) => {
    setRefreshing(accountId)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.REFRESH_ANALYTICS(accountId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await fetchAnalyticsData()
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error)
    } finally {
      setRefreshing(null)
    }
  }

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0'
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const getAnalyticsCards = (data: AnalyticsData) => {
    const cards = []

    if (data.platform_name === 'youtube') {
      cards.push(
        {
          title: 'Subscribers',
          value: formatNumber(data.subscriber_count),
          icon: Users,
          color: 'text-red-500',
          bgColor: 'bg-red-50'
        },
        {
          title: 'Videos',
          value: formatNumber(data.video_count),
          icon: VideoIcon,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50'
        },
        {
          title: 'Total Views',
          value: formatNumber(data.view_count),
          icon: Eye,
          color: 'text-green-500',
          bgColor: 'bg-green-50'
        }
      )
    } else if (data.platform_name === 'instagram') {
      cards.push(
        {
          title: 'Followers',
          value: formatNumber(data.follower_count),
          icon: Users,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50'
        },
        {
          title: 'Media Posts',
          value: formatNumber(data.media_count),
          icon: VideoIcon,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50'
        }
      )
    }

    return cards
  }

  const filteredAnalytics = selectedPlatform === 'all' 
    ? analytics 
    : analytics.filter(data => data.platform_name === selectedPlatform)

  const uniquePlatforms = [...new Set(analytics.map(data => data.platform_name))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
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
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-sm text-gray-500">Monitor your social media performance</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Platform Filter */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Platforms</option>
                {uniquePlatforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
              
              <button
                onClick={fetchAnalyticsData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        {analytics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                  <p className="text-3xl font-bold text-gray-900">{connectedAccounts.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Followers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(
                      analytics.reduce((sum, data) => 
                        sum + (data.subscriber_count || data.follower_count || 0), 0
                      )
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Content</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(
                      analytics.reduce((sum, data) => 
                        sum + (data.video_count || data.media_count || 0), 0
                      )
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <VideoIcon className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(
                      analytics.reduce((sum, data) => sum + (data.view_count || 0), 0)
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Individual Account Analytics */}
        {filteredAnalytics.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-500 mb-6">
              {connectedAccounts.length === 0 
                ? 'Connect your social media accounts to view analytics.'
                : 'Analytics data will appear here once available from your connected platforms.'
              }
            </p>
            {connectedAccounts.length === 0 && (
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Connect Accounts</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAnalytics.map((data, index) => (
              <motion.div
                key={data.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                {/* Account Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {data.platform_display_name} Analytics
                      </h3>
                      <p className="text-sm text-gray-500">
                        @{data.platform_username}
                        {data.account_id && (
                          <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                            ID: {data.account_id}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">
                      Updated: {new Date(data.last_updated).toLocaleString()}
                    </span>
                    <button
                      onClick={() => router.push(`/analytics/${data.account_id}`)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1 inline" />
                      View Details
                    </button>
                    <button
                      onClick={() => refreshAnalytics(data.account_id)}
                      disabled={refreshing === data.account_id}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing === data.account_id ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {getAnalyticsCards(data).map((card, cardIndex) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: cardIndex * 0.1 }}
                      className={`${card.bgColor} rounded-lg p-4`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{card.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                        <card.icon className={`w-8 h-8 ${card.color}`} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Insights */}
                {data.platform_name === 'youtube' && data.subscriber_count && data.video_count && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Channel Insights</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Avg. Views per Video:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {data.view_count && data.video_count 
                            ? formatNumber(Math.round(data.view_count / data.video_count))
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Videos per Subscriber:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {data.video_count && data.subscriber_count
                            ? (data.video_count / data.subscriber_count * 1000).toFixed(1) + ' per 1K'
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}