'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Trash2, AlertCircle, CheckCircle } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info' | 'success'
  loading?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false
}: ConfirmationModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-6 h-6 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />
      case 'info':
        return <AlertCircle className="w-6 h-6 text-blue-600" />
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      default:
        return <AlertTriangle className="w-6 h-6 text-red-600" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          titleColor: 'text-red-900'
        }
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          titleColor: 'text-yellow-900'
        }
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          titleColor: 'text-blue-900'
        }
      case 'success':
        return {
          iconBg: 'bg-green-100',
          confirmButton: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
          titleColor: 'text-green-900'
        }
      default:
        return {
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          titleColor: 'text-red-900'
        }
    }
  }

  const colors = getColors()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Icon */}
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mb-4">
                  <div className={`${colors.iconBg} rounded-full p-3`}>
                    {getIcon()}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4 text-center">
                  <h3 className={`text-lg font-semibold ${colors.titleColor}`}>
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                  {cancelText && (
                    <button
                      onClick={onClose}
                      disabled={loading}
                      className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                    >
                      {cancelText}
                    </button>
                  )}
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`inline-flex w-full justify-center items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto ${colors.confirmButton}`}
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{loading ? 'Processing...' : confirmText}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}