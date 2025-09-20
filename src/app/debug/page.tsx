'use client'

import { useAuthStore } from '@/hooks/useAuth'
import { useEffect } from 'react'

export default function AuthDebugPage() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Authentication Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <strong>Loading State:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User Data:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Access Token:</strong> {typeof window !== 'undefined' ? localStorage.getItem('access_token')?.substring(0, 20) + '...' : 'N/A'}
          </div>
          <div>
            <strong>Refresh Token:</strong> {typeof window !== 'undefined' ? localStorage.getItem('refresh_token')?.substring(0, 20) + '...' : 'N/A'}
          </div>
        </div>

        <div className="mt-8 space-x-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => window.location.href = '/settings'}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Settings
          </button>
          <button
            onClick={checkAuth}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Refresh Auth
          </button>
        </div>
      </div>
    </div>
  )
}