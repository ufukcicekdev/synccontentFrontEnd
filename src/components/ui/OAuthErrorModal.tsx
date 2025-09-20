'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, ExternalLink } from 'lucide-react'

interface OAuthErrorModalProps {
  isOpen: boolean
  onClose: () => void
  platform: string
  error: string
}

const platformSetupInstructions = {
  instagram: {
    name: 'Instagram',
    setupUrl: 'https://developers.facebook.com/apps/',
    instructions: [
      'Go to Facebook Developers Console',
      'Create a new app or select existing app',
      'Add Instagram Basic Display product',
      'Configure OAuth redirect URIs',
      'Copy Client ID and Client Secret'
    ]
  },
  youtube: {
    name: 'YouTube',
    setupUrl: 'https://console.cloud.google.com/',
    instructions: [
      'Go to Google Cloud Console',
      'Create a new project or select existing project',
      'Enable YouTube Data API v3',
      'Create OAuth 2.0 credentials',
      'Add authorized redirect URIs',
      'Copy Client ID and Client Secret'
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    setupUrl: 'https://www.linkedin.com/developers/apps',
    instructions: [
      'Go to LinkedIn Developer Portal',
      'Create a new app',
      'Add Sign In with LinkedIn product',
      'Configure OAuth 2.0 settings',
      'Copy Client ID and Client Secret'
    ]
  },
  twitter: {
    name: 'Twitter/X',
    setupUrl: 'https://developer.twitter.com/apps',
    instructions: [
      'Go to Twitter Developer Portal',
      'Create a new app',
      'Configure OAuth 2.0 settings',
      'Add callback URLs',
      'Copy Client ID and Client Secret'
    ]
  },
  tiktok: {
    name: 'TikTok',
    setupUrl: 'https://developers.tiktok.com/',
    instructions: [
      'Go to TikTok Developers Portal',
      'Create a new app',
      'Enable Login Kit',
      'Configure redirect URLs',
      'Copy Client Key and Client Secret'
    ]
  }
}

export function OAuthErrorModal({ isOpen, onClose, platform, error }: OAuthErrorModalProps) {
  const platformInfo = platformSetupInstructions[platform as keyof typeof platformSetupInstructions]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {platformInfo?.name || platform} Setup Required
                  </h3>
                  <p className="text-sm text-gray-500">OAuth configuration needed</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 font-medium">Error:</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>

              {platformInfo && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      To connect {platformInfo.name}:
                    </h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      {platformInfo.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                            {index + 1}
                          </span>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={platformInfo.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Setup {platformInfo.name}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}