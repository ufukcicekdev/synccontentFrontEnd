'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, ExternalLink, Code, Send, Key, Zap, CheckCircle } from 'lucide-react'
import { API_BASE_URL, API_ENDPOINTS } from '@/config/constants'

export default function UserGuidePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    n8nPost: `{
  "platform": "instagram",
  "content": {
    "text": "Check out this amazing sunset! 🌅 #sunset #photography",
    "media_url": "https://example.com/image.jpg"
  },
  "schedule_time": "2024-01-15T18:00:00Z"
}`,
    curlExample: `curl -X POST ${API_ENDPOINTS.SOCIAL_POST} \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "platform": "instagram",
    "content": {
      "text": "Hello from SocialSync! 🚀",
      "media_url": "https://example.com/image.jpg"
    }
  }'`,
    pythonExample: `import requests
import json

# Your API token from SocialSync settings
API_TOKEN = "your_api_token_here"
BASE_URL = "${API_BASE_URL}/api"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

# Post content to social media
data = {
    "platform": "instagram",
    "content": {
        "text": "Posted from Python! 🐍",
        "media_url": "https://example.com/image.jpg"
    }
}

response = requests.post(f"{BASE_URL}/social/post/", 
                        headers=headers, 
                        json=data)

if response.status_code == 200:
    print("Posted successfully!")
else:
    print(f"Error: {response.text}")`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/settings"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Settings</span>
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">n8n Integration Guide</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to SocialSync API</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Automate your social media posting with n8n workflows! This guide will show you how to connect your SocialSync account 
              to n8n and start posting content automatically across your connected social platforms.
            </p>
          </div>

          {/* Step 1: Generate API Token */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold">1</span>
              <h3 className="text-xl font-semibold text-gray-900">Generate Your API Token</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                First, you need to generate an API token to authenticate your requests:
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Go to Settings → API Tokens tab</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Enter a descriptive name (e.g., &quot;n8n-automation&quot;)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Click &quot;Generate&quot; and copy your token immediately</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Store it securely - you won&apos;t see it again!</span>
                  </li>
                </ol>
              </div>
              <Link 
                href="/settings"
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>Go to API Tokens</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Step 2: n8n Setup */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold">2</span>
              <h3 className="text-xl font-semibold text-gray-900">Set Up n8n Workflow</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                In your n8n workflow, add an HTTP Request node with these settings:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">POST</code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">${API_ENDPOINTS.SOCIAL_POST}</code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Authentication</label>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Bearer Token</code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Your generated API token</code>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Request Format */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold">3</span>
              <h3 className="text-xl font-semibold text-gray-900">Request Body Format</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Use this JSON format in your n8n HTTP Request node body:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.n8nPost}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples.n8nPost, 'n8nPost')}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                  title="Copy code"
                >
                  {copiedCode === 'n8nPost' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Supported Platforms */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Instagram', key: 'instagram', color: 'bg-pink-100 text-pink-700' },
                { name: 'Twitter/X', key: 'twitter', color: 'bg-blue-100 text-blue-700' },
                { name: 'LinkedIn', key: 'linkedin', color: 'bg-blue-100 text-blue-700' },
                { name: 'YouTube', key: 'youtube', color: 'bg-red-100 text-red-700' },
                { name: 'TikTok', key: 'tiktok', color: 'bg-gray-100 text-gray-700' },
              ].map((platform) => (
                <div key={platform.key} className={`p-3 rounded-lg ${platform.color}`}>
                  <div className="font-medium">{platform.name}</div>
                  <code className="text-xs opacity-75">{platform.key}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Content Types */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Types</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">Text Only</h4>
                <p className="text-gray-600 text-sm">Just include &quot;text&quot; in the content object</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">{'{"content": {"text": "Your message here"}}'}</code>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900">Text + Image</h4>
                <p className="text-gray-600 text-sm">Include both &quot;text&quot; and &quot;media_url&quot;</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">{'{"content": {"text": "Caption", "media_url": "https://..."}}'}</code>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-900">Scheduled Posts</h4>
                <p className="text-gray-600 text-sm">Add &quot;schedule_time&quot; in ISO format</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">&quot;schedule_time&quot;: &quot;2024-01-15T18:00:00Z&quot;</code>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Code Examples</h3>
            
            {/* cURL Example */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>cURL Example</span>
              </h4>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.curlExample}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples.curlExample, 'curl')}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                >
                  {copiedCode === 'curl' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Python Example */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Python Example</span>
              </h4>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.pythonExample}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples.pythonExample, 'python')}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                >
                  {copiedCode === 'python' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Response Format */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">API Response</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Success Response (200)</h4>
                <pre className="bg-green-50 text-green-800 p-3 rounded-lg text-sm">
{`{
  "status": "success",
  "message": "Post created successfully",
  "post_id": "12345",
  "platform": "instagram",
  "scheduled": false
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-medium text-red-700 mb-2">Error Response (400/401)</h4>
                <pre className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
{`{
  "status": "error",
  "message": "Invalid platform or missing content",
  "error_code": "INVALID_REQUEST"
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Tips & Best Practices */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Tips & Best Practices</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Rate Limits:</strong> Be mindful of platform rate limits. Instagram allows ~25 posts/day, Twitter has different limits.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Media URLs:</strong> Use publicly accessible image URLs. Local files need to be uploaded to a public server first.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Content Guidelines:</strong> Follow each platform&apos;s content policies to avoid automatic rejections.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Testing:</strong> Start with a test account and verify posts before setting up production workflows.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Token Security:</strong> Never commit API tokens to code repositories. Use environment variables in n8n.</p>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
            <p className="mb-4 opacity-90">
              Connect your social accounts, generate an API token, and start automating your social media posts with n8n!
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center space-x-2 bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Connect Accounts</span>
              </Link>
              <Link 
                href="/settings"
                className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white hover:bg-white hover:text-purple-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>Generate Token</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}