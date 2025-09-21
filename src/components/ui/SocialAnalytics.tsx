'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  VideoIcon, 
  Eye, 
  TrendingUp, 
  RefreshCw, 
  Calendar,
  BarChart3,
  Activity,
  ExternalLink
} from 'lucide-react'
import { API_ENDPOINTS } from '@/config/constants'

interface AnalyticsData {
  id: number
  account_id: number  // Add account_id field
  platform_name: string
  platform_display_name: string
  platform_username: string
  subscriber_count?: number
  video_count?: number
  view_count?: number
  follower_count?: number
  following_count?: number
  media_count?: number
  connection_count?: number  // Add LinkedIn connection count
  last_updated: string
}

interface SocialAnalyticsProps {
  accountId?: number
  platformName?: string
}

export function SocialAnalytics({ accountId, platformName }: SocialAnalyticsProps) {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState<number | null>(null)

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const url = accountId 
        ? API_ENDPOINTS.ACCOUNT_ANALYTICS(accountId)
        : API_ENDPOINTS.ANALYTICS

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Analytics data received:', data) // Debug log
        setAnalytics(Array.isArray(data) ? data : [data])
      } else {
        console.error('Failed to fetch analytics:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshAnalytics = async (accountId: number) => {
    console.log('Refreshing analytics for account ID:', accountId) // Debug log
    if (!accountId || accountId === undefined) {
      console.error('Invalid account ID for refresh:', accountId)
      return
    }
    
    setRefreshing(accountId)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.error('No access token found')
        return
      }

      const url = API_ENDPOINTS.REFRESH_ANALYTICS(accountId)
      console.log('Refresh URL:', url) // Debug log
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        console.log('Analytics refresh successful')
        // Refresh the analytics data
        await fetchAnalytics()
      } else {
        console.error('Failed to refresh analytics:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error)
    } finally {
      setRefreshing(null)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [accountId])

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
          title: 'Media Posts',
          value: formatNumber(data.media_count),
          icon: VideoIcon,
          color: 'text-pink-500',
          bgColor: 'bg-pink-50'
        }
      )
    } else if (data.platform_name === 'linkedin') {
      // Add LinkedIn-specific analytics cards
      cards.push(
        {
          title: 'Connections',
          value: formatNumber(data.connection_count),
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        }
      )
      
      // If we have more LinkedIn metrics in the future, we can add them here
    }

    return cards
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    )
  }

  if (analytics.length === 0) {
    return (
      <div className="text-center p-8">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-500">
          Analytics will appear here once your social media accounts are connected and data is available.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {analytics.map((data, index) => (
        <motion.div
          key={data.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          {/* Platform Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
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
                title="View detailed analytics"
              >
                <ExternalLink className="w-3 h-3 mr-1 inline" />
                View Details
              </button>
              <button
                onClick={async () => {
                  const token = localStorage.getItem('access_token')
                  const response = await fetch(API_ENDPOINTS.DEBUG_ACCOUNT(data.account_id), {
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  const debugData = await response.json()
                  console.log('Debug data:', debugData)
                  alert(JSON.stringify(debugData, null, 2))
                }}
                className="px-3 py-1 text-xs bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                title="Debug account"
              >
                Debug
              </button>
              <button
                onClick={() => {
                  console.log('Refresh button clicked for data:', data) // Debug log
                  if (data.account_id) {
                    refreshAnalytics(data.account_id)
                  } else {
                    console.error('No account_id found in data:', data)
                  }
                }}
                disabled={refreshing === data.account_id || !data.account_id}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                title="Refresh analytics"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing === data.account_id ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Channel Insights</h4>
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
  )
}