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

interface InstagramMediaData {
  id: number
  media_id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption: string
  like_count: number
  comments_count: number
  timestamp: string
  total_engagement: number
  engagement_rate: number
}

interface DetailedAnalyticsData {
  id: number
  account_id: number
  platform_name: string
  platform_display_name: string
  platform_username: string
  last_updated: string
  
  // YouTube specific fields
  subscriber_count?: number
  video_count?: number
  total_view_count?: number
  
  // LinkedIn specific fields
  connection_count?: number
  follower_count?: number
  post_count?: number
  profile_views?: number
  total_organizations?: number
  
  // Instagram specific fields
  following_count?: number
  media_count?: number
  recent_media?: InstagramMediaData[]
  
  // Twitter specific fields
  tweet_count?: number
  
  // Common fields
  engagement_rate?: number
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
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.total_view_count)}</p>
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
                      {analytics.total_view_count && analytics.video_count 
                        ? formatNumber(Math.round(analytics.total_view_count / analytics.video_count))
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
          
          {analytics.platform_name === 'linkedin' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connections</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.connection_count || 0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Requires special LinkedIn approval</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
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
                    <p className="text-sm font-medium text-gray-600">Posts</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.post_count || 0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Published posts</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-500" />
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
                    <p className="text-sm font-medium text-gray-600">Profile Views</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.profile_views || 0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Profile visibility</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-500" />
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
                    <p className="text-sm font-medium text-gray-600">Organizations</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.total_organizations || 0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Company pages</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
          
          {analytics.platform_name === 'instagram' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Followers</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.follower_count || 0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Account followers</p>
                  </div>
                  <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-500" />
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
                    <p className="text-sm font-medium text-gray-600">Following</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.following_count || 0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Accounts followed</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-500" />
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
                    <p className="text-sm font-medium text-gray-600">Media Posts</p>
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(analytics.media_count || 0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Images & videos</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <VideoIcon className="w-6 h-6 text-blue-500" />
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

        {/* Platform Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {analytics.platform_name === 'linkedin' ? 'LinkedIn Insights' : 'Channel Insights'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.platform_name === 'youtube' && (
              <>
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
                    {analytics.total_view_count && analytics.video_count 
                      ? formatNumber(Math.round(analytics.total_view_count / analytics.video_count))
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
              </>
            )}
            
            {analytics.platform_name === 'linkedin' && (
              <>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    0
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Search appearances</div>
                  <div className="text-xs text-gray-500 mt-1">Profile visibility in searches</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    0
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Managed pages</div>
                  <div className="text-xs text-gray-500 mt-1">Company pages you manage</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDate(analytics.last_updated)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Last updated</div>
                  <div className="text-xs text-gray-500 mt-1">Analytics refresh time</div>
                </div>
              </>
            )}
          </div>
          
          {analytics.platform_name === 'linkedin' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">LinkedIn API Limitations</h3>
              <p className="text-sm text-blue-700">
                Some LinkedIn analytics features require special permissions or LinkedIn Partner Program approval. 
                The connection count and detailed engagement metrics may show as zero due to API restrictions.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Instagram Posts Section */}
        {analytics.platform_name === 'instagram' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Instagram Media</h2>
              <button
                onClick={refreshAnalytics}
                disabled={refreshing}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-pink-600 hover:text-pink-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
            
            {/* Instagram Media Grid */}
            {analytics.recent_media && analytics.recent_media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {analytics.recent_media.map((media) => (
                  <motion.div
                    key={media.media_id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-50 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square relative">
                      {media.media_url && (
                        <img
                          src={media.media_url}
                          alt={media.caption || 'Instagram post'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/300/300'
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-3 text-white">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{media.like_count || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{media.comments_count || 0}</span>
                          </div>
                        </div>
                      </div>
                      {media.media_type === 'VIDEO' && (
                        <div className="absolute top-2 right-2">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {media.media_type === 'CAROUSEL_ALBUM' && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-black bg-opacity-50 rounded px-2 py-1">
                            <span className="text-white text-xs">Multiple</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {media.caption || 'No caption'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(media.timestamp)}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {media.total_engagement} engagements
                        </span>
                        <a
                          href={media.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 text-xs flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <VideoIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Instagram Media</h3>
                <p className="text-sm mb-4">
                  Your Instagram media posts will appear here once data is available.
                </p>
                <p className="text-xs text-gray-400">
                  Note: Instagram Basic Display API provides limited analytics data.
                </p>
              </div>
            )}
          </motion.div>
        )}
        
        {/* LinkedIn Posts Section */}
        {analytics.platform_name === 'linkedin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">LinkedIn Activity</h2>
              <button
                onClick={refreshAnalytics}
                disabled={refreshing}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Recent Posts</p>
                    <p className="text-lg font-bold text-blue-900">{analytics.post_count || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Profile Views</p>
                    <p className="text-lg font-bold text-green-900">{analytics.profile_views || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">Connections</p>
                    <p className="text-lg font-bold text-purple-900">{analytics.connection_count || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Organizations</p>
                    <p className="text-lg font-bold text-yellow-900">{analytics.total_organizations || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">LinkedIn Posts & Activity</h3>
              <p className="text-sm mb-4">
                Post details and engagement metrics will appear here once available through LinkedIn&apos;s API.
              </p>
              <p className="text-xs text-gray-400">
                Note: Due to LinkedIn API restrictions, detailed post analytics may require additional permissions.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}