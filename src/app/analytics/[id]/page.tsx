'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  Play,
  Clock,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react'
import { API_ENDPOINTS } from '@/config/constants'
import { VideoEditor } from '@/components/ui/VideoEditor'

interface VideoData {
  video_id: string
  title: string
  description: string
  category_id: string
  tags: string[]
  privacy_status: string
  default_language: string
  default_audio_language: string
  thumbnail: string
  published_at: string
  url: string
  view_count?: number
  like_count?: number
  comment_count?: number
  made_for_kids?: boolean
}

interface DetailedAnalyticsData {
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
  recent_videos?: VideoData[]
  growth_metrics?: {
    subscriber_growth: number
    view_growth: number
    engagement_rate: number
  }
}

export default function DetailedAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.id as string
  
  const [analytics, setAnalytics] = useState<DetailedAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [videos, setVideos] = useState<VideoData[]>([])

  const fetchDetailedAnalytics = async () => {
    if (!accountId) return
    
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.DETAILED_ANALYTICS(parseInt(accountId)), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
        
        // If it's YouTube, also fetch videos for editing
        if (data.platform_name === 'youtube') {
          fetchVideos()
        }
      }
    } catch (error) {
      console.error('Error fetching detailed analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async () => {
    if (!accountId) return
    
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.VIDEOS(parseInt(accountId)) + '?max_results=20', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const refreshAnalytics = async () => {
    if (!accountId) return
    
    setRefreshing(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.REFRESH_ANALYTICS(parseInt(accountId)), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await fetchDetailedAnalytics()
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleVideoUpdated = (videoId: string, updatedData: VideoData) => {
    // Update the video in the videos list
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.video_id === videoId ? updatedData : video
      )
    )

    // Also update in recent videos if it exists there
    if (analytics?.recent_videos) {
      setAnalytics(prevAnalytics => {
        if (!prevAnalytics) return prevAnalytics
        return {
          ...prevAnalytics,
          recent_videos: prevAnalytics.recent_videos?.map(video => 
            video.video_id === videoId ? updatedData : video
          )
        }
      })
    }
  }

  useEffect(() => {
    fetchDetailedAnalytics()
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading detailed analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-500 mb-4">Analytics data is not available for this account.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
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
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {analytics.platform_display_name} Analytics
                </h1>
                <p className="text-sm text-gray-500">@{analytics.platform_username}</p>
              </div>
            </div>
            
            <button
              onClick={refreshAnalytics}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {analytics.platform_name === 'youtube' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subscribers</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.subscriber_count)}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-red-500" />
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
                    <p className="text-sm font-medium text-gray-600">Videos</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.video_count)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <VideoIcon className="w-6 h-6 text-blue-500" />
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
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.view_count)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-500" />
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
                    <p className="text-sm font-medium text-gray-600">Avg. Views/Video</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.view_count && analytics.video_count 
                        ? formatNumber(Math.round(analytics.view_count / analytics.video_count))
                        : '0'
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Video Management Section for YouTube */}
        {analytics.platform_name === 'youtube' && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border p-6 mb-8"
          >
            <VideoEditor
              accountId={parseInt(accountId)}
              videos={videos}
              onVideoUpdated={handleVideoUpdated}
            />
          </motion.div>
        )}

        {/* Channel Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Channel Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {analytics.video_count && analytics.subscriber_count
                  ? (analytics.video_count / analytics.subscriber_count * 1000).toFixed(1)
                  : '0'
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">Videos per 1K subscribers</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {analytics.view_count && analytics.video_count 
                  ? formatNumber(Math.round(analytics.view_count / analytics.video_count))
                  : '0'
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">Average views per video</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formatDate(analytics.last_updated)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Last updated</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}