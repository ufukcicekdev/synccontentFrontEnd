'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Edit3, 
  Save, 
  X, 
  Eye, 
  Calendar, 
  Tag,
  FileText,
  Video,
  AlertCircle,
  Check,
  RefreshCw
} from 'lucide-react'
import { API_ENDPOINTS } from '@/config/constants'
import { CustomSelect } from './CustomSelect'

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
  made_for_kids?: boolean
}

interface VideoCategory {
  id: string
  title: string
}

interface SupportedLanguage {
  code: string
  name: string
}

interface VideoEditorProps {
  accountId: number
  videos: VideoData[]
  onVideoUpdated: (videoId: string, updatedData: VideoData) => void
}

interface EditingVideo {
  video_id: string
  title: string
  description: string
  category_id: string
  tags: string[]
  privacy_status: string
  default_language: string
  default_audio_language: string
  made_for_kids: boolean
}

export function VideoEditor({ accountId, videos, onVideoUpdated }: VideoEditorProps) {
  const [editingVideo, setEditingVideo] = useState<string | null>(null)
  const [videoDetails, setVideoDetails] = useState<VideoData | null>(null)
  const [editForm, setEditForm] = useState<EditingVideo | null>(null)
  const [categories, setCategories] = useState<VideoCategory[]>([])
  const [languages, setLanguages] = useState<SupportedLanguage[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [languagesLoading, setLanguagesLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (accountId) {
      fetchCategories()
      fetchSupportedLanguages()
    }
  }, [accountId])

  const fetchSupportedLanguages = async () => {
    setLanguagesLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.warn('No access token available for fetching languages')
        setLanguages([
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'tr', name: 'Turkish' },
          { code: 'ar', name: 'Arabic' }
        ])
        return
      }

      console.log('Fetching languages from:', API_ENDPOINTS.SUPPORTED_LANGUAGES(accountId))
      const response = await fetch(API_ENDPOINTS.SUPPORTED_LANGUAGES(accountId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Languages API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        setLanguages(data)
        console.log('Successfully fetched languages from YouTube:', data.length, 'languages')
      } else if (response.status === 401) {
        console.warn('Authentication failed - token may be expired for languages')
        const errorText = await response.text()
        console.warn('Error details:', errorText)
        setLanguages([
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'tr', name: 'Turkish' },
          { code: 'ar', name: 'Arabic' }
        ])
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch languages. Status:', response.status, 'Error:', errorText)
        setLanguages([
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'tr', name: 'Turkish' },
          { code: 'ar', name: 'Arabic' }
        ])
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
      setLanguages([
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'tr', name: 'Turkish' },
        { code: 'ar', name: 'Arabic' }
      ])
    } finally {
      setLanguagesLoading(false)
    }
  }

  const fetchCategories = async () => {
    setCategoriesLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.warn('No access token available for fetching categories')
        setCategories([
          { id: '10', title: 'Music' },
          { id: '20', title: 'Gaming' },
          { id: '22', title: 'People & Blogs' },
          { id: '23', title: 'Comedy' },
          { id: '24', title: 'Entertainment' },
          { id: '26', title: 'Howto & Style' },
          { id: '27', title: 'Education' },
          { id: '28', title: 'Science & Technology' }
        ])
        return
      }

      console.log('Fetching categories from:', API_ENDPOINTS.VIDEO_CATEGORIES(accountId))
      const response = await fetch(API_ENDPOINTS.VIDEO_CATEGORIES(accountId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Categories API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        console.log('Successfully fetched categories from YouTube:', data.length, 'categories')
      } else if (response.status === 401) {
        console.warn('Authentication failed - token may be expired for categories')
        const errorText = await response.text()
        console.warn('Error details:', errorText)
        setCategories([
          { id: '10', title: 'Music' },
          { id: '20', title: 'Gaming' },
          { id: '22', title: 'People & Blogs' },
          { id: '23', title: 'Comedy' },
          { id: '24', title: 'Entertainment' },
          { id: '26', title: 'Howto & Style' },
          { id: '27', title: 'Education' },
          { id: '28', title: 'Science & Technology' }
        ])
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch categories. Status:', response.status, 'Error:', errorText)
        setCategories([
          { id: '10', title: 'Music' },
          { id: '20', title: 'Gaming' },
          { id: '22', title: 'People & Blogs' },
          { id: '23', title: 'Comedy' },
          { id: '24', title: 'Entertainment' },
          { id: '26', title: 'Howto & Style' },
          { id: '27', title: 'Education' },
          { id: '28', title: 'Science & Technology' }
        ])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([
        { id: '10', title: 'Music' },
        { id: '20', title: 'Gaming' },
        { id: '22', title: 'People & Blogs' },
        { id: '23', title: 'Comedy' },
        { id: '24', title: 'Entertainment' },
        { id: '26', title: 'Howto & Style' },
        { id: '27', title: 'Education' },
        { id: '28', title: 'Science & Technology' }
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }

  const fetchVideoDetails = async (videoId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.VIDEO_DETAILS(accountId, videoId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVideoDetails(data)
        setEditForm({
          video_id: data.video_id,
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          tags: data.tags || [],
          privacy_status: data.privacy_status || 'private',
          default_language: data.default_language || '',
          default_audio_language: data.default_audio_language || '',
          made_for_kids: data.made_for_kids || false
        })
      } else {
        setError('Failed to fetch video details')
      }
    } catch (error) {
      console.error('Error fetching video details:', error)
      setError('Error fetching video details')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (videoId: string) => {
    setEditingVideo(videoId)
    setError(null)
    setSuccess(null)
    fetchVideoDetails(videoId)
  }

  const handleCancelEdit = () => {
    setEditingVideo(null)
    setVideoDetails(null)
    setEditForm(null)
    setError(null)
    setSuccess(null)
  }

  const handleSave = async () => {
    if (!editForm) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const updateData = {
        title: editForm.title,
        description: editForm.description,
        category_id: editForm.category_id,
        tags: editForm.tags,
        privacy_status: editForm.privacy_status,
        default_language: editForm.default_language,
        default_audio_language: editForm.default_audio_language,
        made_for_kids: editForm.made_for_kids
      }

      const response = await fetch(API_ENDPOINTS.UPDATE_VIDEO(accountId, editForm.video_id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const result = await response.json()
        setSuccess('Video updated successfully!')
        
        // Update the video in the parent component
        if (videoDetails) {
          const updatedVideo = {
            ...videoDetails,
            title: editForm.title,
            description: editForm.description,
            category_id: editForm.category_id,
            tags: editForm.tags,
            privacy_status: editForm.privacy_status,
            default_language: editForm.default_language,
            default_audio_language: editForm.default_audio_language,
            made_for_kids: editForm.made_for_kids
          }
          onVideoUpdated(editForm.video_id, updatedVideo)
        }
        
        // Close editor after 2 seconds
        setTimeout(() => {
          handleCancelEdit()
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update video')
      }
    } catch (error) {
      console.error('Error updating video:', error)
      setError('Error updating video')
    } finally {
      setSaving(false)
    }
  }

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setEditForm(prev => prev ? { ...prev, tags } : null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Management</h3>
      
      {videos.length === 0 ? (
        <div className="text-center py-8">
          <Video className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No videos found for this account.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video, index) => (
            <motion.div
              key={video.video_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {video.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(video.published_at)}
                    </span>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </a>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEditClick(video.video_id)}
                  disabled={editingVideo === video.video_id}
                  className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Editing Modal */}
      <AnimatePresence>
        {editingVideo && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Video</h3>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading video details...</p>
                  </div>
                ) : editForm ? (
                  <div className="space-y-6">
                    {/* Video Preview */}
                    {videoDetails && (
                      <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={videoDetails.thumbnail}
                          alt={videoDetails.title}
                          className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{videoDetails.title}</p>
                          <p className="text-xs text-gray-500">Published: {formatDate(videoDetails.published_at)}</p>
                        </div>
                      </div>
                    )}

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                        maxLength={100}
                        placeholder="Enter a compelling title for your video"
                      />
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Choose a title that accurately describes your content</p>
                        <p className="text-xs text-gray-400">{editForm.title.length}/100</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, description: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400 resize-none"
                        rows={6}
                        maxLength={5000}
                        placeholder="Describe your video content, include relevant keywords and information that helps viewers understand what they'll see..."
                      />
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Include keywords and relevant information</p>
                        <p className="text-xs text-gray-400">{editForm.description.length}/5000</p>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <CustomSelect
                        options={categories.map(cat => ({ value: cat.id, label: cat.title }))}
                        value={editForm.category_id}
                        onChange={(value) => setEditForm(prev => prev ? { ...prev, category_id: value } : null)}
                        placeholder={categoriesLoading ? 'Loading categories...' : 'Select a category'}
                        disabled={categoriesLoading}
                        loading={categoriesLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {categoriesLoading ? 'Fetching from YouTube...' : 'Choose the best category for your content'}
                      </p>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={editForm.tags.join(', ')}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
                        placeholder="gaming, tutorial, review, entertainment"
                      />
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Separate tags with commas to help people find your video</p>
                        <p className="text-xs text-gray-400">{editForm.tags.length} tags</p>
                      </div>
                    </div>

                    {/* Privacy Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Privacy Status
                      </label>
                      <CustomSelect
                        options={[
                          { value: 'private', label: 'Private' },
                          { value: 'public', label: 'Public' },
                          { value: 'unlisted', label: 'Unlisted' }
                        ]}
                        value={editForm.privacy_status}
                        onChange={(value) => setEditForm(prev => prev ? { ...prev, privacy_status: value } : null)}
                        placeholder="Select privacy status"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Controls who can view your video
                      </p>
                    </div>

                    {/* Default Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Language
                      </label>
                      <CustomSelect
                        options={languages.map(lang => ({ value: lang.code, label: lang.name }))}
                        value={editForm.default_language}
                        onChange={(value) => setEditForm(prev => prev ? { ...prev, default_language: value } : null)}
                        placeholder={languagesLoading ? 'Loading languages...' : 'Select language'}
                        disabled={languagesLoading}
                        loading={languagesLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {languagesLoading ? 'Fetching from YouTube...' : 'Primary language of your video content'}
                      </p>
                    </div>

                    {/* Default Audio Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audio Language
                      </label>
                      <CustomSelect
                        options={languages.map(lang => ({ value: lang.code, label: lang.name }))}
                        value={editForm.default_audio_language}
                        onChange={(value) => setEditForm(prev => prev ? { ...prev, default_audio_language: value } : null)}
                        placeholder={languagesLoading ? 'Loading languages...' : 'Select audio language'}
                        disabled={languagesLoading}
                        loading={languagesLoading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {languagesLoading ? 'Fetching from YouTube...' : 'Language spoken in your video'}
                      </p>
                    </div>

                    {/* Made for Kids */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.made_for_kids}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, made_for_kids: e.target.checked } : null)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            Made for Kids
                          </span>
                          <p className="text-xs text-gray-600 mt-1">
                            Check if your content is directed to children under 13. This is required for COPPA compliance.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm text-red-600">{error}</span>
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-600">{success}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {saving ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}