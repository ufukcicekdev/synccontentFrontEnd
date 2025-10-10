'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Eye, 
  Calendar, 
  Edit, 
  Trash2, 
  ExternalLink,
  Building,
  User,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react'
import { API_ENDPOINTS } from '@/config/constants'

interface LinkedInPost {
  id: string
  post_id: string
  urn: string
  post_type: string
  state: string
  text_content: string
  media_urls: string[]
  like_count: number
  comment_count: number
  share_count: number
  view_count: number
  total_engagement: number
  engagement_rate: number
  organization_name?: string
  published_at: string
  created_at: string
}

interface LinkedInPostListProps {
  accountId: number
  onPostUpdated?: () => void
}

export function LinkedInPostList({ accountId, onPostUpdated }: LinkedInPostListProps) {
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [accountId, currentPage])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(
        `${API_ENDPOINTS.LINKEDIN_POSTS(accountId)}?page=${currentPage}&page_size=10`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
        setTotalPages(data.pagination?.total_pages || 1)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setActionLoading(postId)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.LINKEDIN_DELETE_POST(accountId, postId), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.post_id !== postId))
        if (onPostUpdated) onPostUpdated()
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Network error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading posts...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">LinkedIn Posts</h3>
          <p className="text-sm text-gray-500">{posts.length} posts found</p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Found</h3>
          <p className="text-gray-500">
            Your LinkedIn posts will appear here once you start sharing content.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.post_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    {post.organization_name ? (
                      <Building className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {post.organization_name || 'Personal Profile'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.published_at).toLocaleDateString()} • {post.post_type}
                    </p>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedPost(selectedPost === post.post_id ? null : post.post_id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {selectedPost === post.post_id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 mt-8 w-48 bg-white rounded-lg shadow-lg border z-10"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => window.open(`https://www.linkedin.com/feed/update/${post.urn}/`, '_blank')}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View on LinkedIn</span>
                        </button>
                        <button
                          onClick={() => deletePost(post.post_id)}
                          disabled={actionLoading === post.post_id}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>{actionLoading === post.post_id ? 'Deleting...' : 'Delete Post'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {truncateText(post.text_content)}
                </p>
                
                {/* Media URLs */}
                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {post.media_urls.map((url, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 truncate"
                        >
                          {url}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(post.like_count)}
                  </span>
                  <span className="text-xs text-gray-500">Likes</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(post.comment_count)}
                  </span>
                  <span className="text-xs text-gray-500">Comments</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Share className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(post.share_count)}
                  </span>
                  <span className="text-xs text-gray-500">Shares</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(post.view_count)}
                  </span>
                  <span className="text-xs text-gray-500">Views</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Total Engagement:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formatNumber(post.total_engagement)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Engagement Rate:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {post.engagement_rate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}