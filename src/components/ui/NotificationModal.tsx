import { X, CheckCircle, Copy } from 'lucide-react'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  showCopyButton?: boolean
  copyText?: string
}

export function NotificationModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info',
  showCopyButton = false,
  copyText = ''
}: NotificationModalProps) {
  if (!isOpen) return null

  const getIconColor = () => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50'
      case 'warning': return 'bg-yellow-50'
      case 'error': return 'bg-red-50'
      default: return 'bg-blue-50'
    }
  }

  const handleCopy = () => {
    if (copyText) {
      navigator.clipboard.writeText(copyText)
    }
  }

  return (
    <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full ${getBgColor()} flex items-center justify-center`}>
              <CheckCircle className={`w-5 h-5 ${getIconColor()}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-600 mb-4">{message}</p>
          
          {showCopyButton && copyText && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-900 break-all">
                  {copyText}
                </code>
                <button
                  onClick={handleCopy}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy token"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}