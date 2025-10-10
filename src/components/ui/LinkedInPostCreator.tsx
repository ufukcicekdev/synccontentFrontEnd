'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Image, 
  Calendar, 
  Users, 
  Building, 
  Type,
  Bold,
  Italic,
  List,
  Link,
  X,
  Plus,
  Clock
} from 'lucide-react'
import { API_ENDPOINTS } from '@/config/constants'

interface LinkedInPost {
  id: string
  post_id: string
  text_content: string
  created_at: string
  engagement_count?: number
}

interface LinkedInPostCreatorProps {
  accountId: number
  onPostCreated?: (post: LinkedInPost) => void
  onClose?: () => void
}

interface Organization {
  id: number
  organization_id: string
  name: string
  logo_url?: string
  can_post: boolean
}

export function LinkedInPostCreator({ accountId, onPostCreated, onClose }: LinkedInPostCreatorProps) {
  const [textContent, setTextContent] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState<string>('')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [newMediaUrl, setNewMediaUrl] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrganizations()
  }, [accountId])

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return

      const response = await fetch(API_ENDPOINTS.LINKEDIN_ORGANIZATIONS(accountId), {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const addMediaUrl = () => {
    if (newMediaUrl.trim() && !mediaUrls.includes(newMediaUrl.trim())) {
      setMediaUrls([...mediaUrls, newMediaUrl.trim()])
      setNewMediaUrl('')
    }
  }

  const removeMediaUrl = (url: string) => {
    setMediaUrls(mediaUrls.filter(u => u !== url))
  }

  const handleTextFormat = (format: string) => {
    const textarea = document.getElementById('post-content') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textContent.substring(start, end)

    let formattedText = selectedText
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'list':
        formattedText = `• ${selectedText}`
        break
    }

    const newText = textContent.substring(0, start) + formattedText + textContent.substring(end)
    setTextContent(newText)
  }

  const createPost = async () => {
    if (!textContent.trim()) {
      setError('Post content is required')
      return
    }

    setIsPosting(true)
    setError('')

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Authentication required')
        return
      }

      const postData = {
        text_content: textContent,
        organization_id: selectedOrganization || undefined,
        media_urls: mediaUrls,
        scheduled_at: isScheduled && scheduledDate ? scheduledDate : undefined
      }

      const response = await fetch(API_ENDPOINTS.LINKEDIN_CREATE_POST(accountId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        const result = await response.json()
        if (onPostCreated) {
          onPostCreated(result.post)
        }
        
        // Reset form
        setTextContent('')
        setSelectedOrganization('')
        setMediaUrls([])
        setIsScheduled(false)
        setScheduledDate('')
        
        if (onClose) {
          onClose()
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create post')
      }
    } catch (error) {
      setError('Network error occurred')
      console.error('Error creating post:', error)
    } finally {
      setIsPosting(false)
    }
  }

  const characterCount = textContent.length
  const maxCharacters = 3000 // LinkedIn's character limit

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg border p-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Type className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Create LinkedIn Post</h3>
            <p className="text-sm text-gray-500">Share your thoughts with your network</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Organization Selection */}
      {organizations.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post as
          </label>
          <select
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Personal Profile</option>
            {organizations.filter(org => org.can_post).map((org) => (
              <option key={org.organization_id} value={org.organization_id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Text Formatting Toolbar */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => handleTextFormat('bold')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTextFormat('italic')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleTextFormat('list')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <div className="ml-auto text-xs text-gray-500">
            {characterCount}/{maxCharacters}
          </div>
        </div>

        {/* Post Content */}
        <textarea
          id="post-content"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="What do you want to talk about?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={6}
          maxLength={maxCharacters}
        />
      </div>

      {/* Media URLs */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Image className="w-4 h-4 inline mr-1" />
          Media URLs (optional)
        </label>
        
        {mediaUrls.length > 0 && (
          <div className="mb-3 space-y-2">
            {mediaUrls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Link className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 flex-1 truncate">{url}</span>
                <button
                  onClick={() => removeMediaUrl(url)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <input
            type="url"
            value={newMediaUrl}
            onChange={(e) => setNewMediaUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addMediaUrl}
            disabled={!newMediaUrl.trim()}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scheduling */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <input
            type="checkbox"
            id="schedule-post"
            checked={isScheduled}
            onChange={(e) => setIsScheduled(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="schedule-post" className="text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4 inline mr-1" />
            Schedule for later
          </label>
        </div>

        {isScheduled && (
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {selectedOrganization ? (
            <span className="flex items-center">
              <Building className="w-3 h-3 mr-1" />
              Posting as organization
            </span>
          ) : (
            <span className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              Posting to personal profile
            </span>
          )}
        </div>

        <div className="flex space-x-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={createPost}
            disabled={isPosting || !textContent.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPosting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isScheduled ? 'Schedule Post' : 'Post Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}