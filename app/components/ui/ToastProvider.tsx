'use client'

import { Toaster } from 'react-hot-toast'

/**
 * Toast Provider
 * Wraps app with react-hot-toast for notifications
 * 
 * Usage:
 * import toast from 'react-hot-toast'
 * 
 * toast.success('Certificate approved!')
 * toast.error('Failed to save changes')
 * toast.loading('Processing...')
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Success toast
        success: {
          duration: 4000,
          style: {
            background: '#0D1A0D',
            color: '#3DF49A',
            border: '1px solid rgba(61, 244, 154, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#3DF49A',
            secondary: '#0D1A0D',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          style: {
            background: '#1A0D0D',
            color: '#F26B6B',
            border: '1px solid rgba(242, 107, 107, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#F26B6B',
            secondary: '#1A0D0D',
          },
        },
        // Loading toast
        loading: {
          style: {
            background: '#0D0D1A',
            color: '#60A8FA',
            border: '1px solid rgba(96, 168, 250, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          iconTheme: {
            primary: '#60A8FA',
            secondary: '#0D0D1A',
          },
        },
        // Default style for custom toasts
        style: {
          background: '#0F0F0F',
          color: '#F3F6F4',
          border: '1px solid #1E1E1E',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
        },
      }}
    />
  )
}

/**
 * Custom toast helpers
 */
export const showToast = {
  success: (message: string) => {
    const { toast } = require('react-hot-toast')
    toast.success(message)
  },
  error: (message: string) => {
    const { toast } = require('react-hot-toast')
    toast.error(message)
  },
  loading: (message: string) => {
    const { toast } = require('react-hot-toast')
    return toast.loading(message)
  },
  dismiss: (toastId: string) => {
    const { toast } = require('react-hot-toast')
    toast.dismiss(toastId)
  },
}
