'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { NotificationModal } from '@/components/ui/NotificationModal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

interface NotificationOptions {
  title: string
  message: string
  type?: 'success' | 'info' | 'warning' | 'error'
  showCopyButton?: boolean
  copyText?: string
}

interface ConfirmOptions {
  title: string
  message: string
  type?: 'danger' | 'warning' | 'info' | 'success'
  confirmText?: string
  cancelText?: string
}

interface ModalContextType {
  showNotification: (options: NotificationOptions) => void
  showConfirm: (options: ConfirmOptions) => Promise<boolean>
  hideModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProviderProps {
  children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [notificationModal, setNotificationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    showCopyButton?: boolean
    copyText?: string
  }>({ isOpen: false, title: '', message: '', type: 'info' })

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'danger' | 'warning' | 'info' | 'success'
    confirmText: string
    cancelText: string
    resolve?: (value: boolean) => void
  }>({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'danger', 
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  })

  const showNotification = (options: NotificationOptions) => {
    setNotificationModal({
      isOpen: true,
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      showCopyButton: options.showCopyButton,
      copyText: options.copyText
    })
  }

  const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmModal({
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || 'danger',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        resolve
      })
    })
  }

  const hideModals = () => {
    setNotificationModal(prev => ({ ...prev, isOpen: false }))
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  const handleConfirm = () => {
    if (confirmModal.resolve) {
      confirmModal.resolve(true)
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  const handleCancel = () => {
    if (confirmModal.resolve) {
      confirmModal.resolve(false)
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <ModalContext.Provider value={{ showNotification, showConfirm, hideModals }}>
      {children}
      
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
        showCopyButton={notificationModal.showCopyButton}
        copyText={notificationModal.copyText}
      />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
      />
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}