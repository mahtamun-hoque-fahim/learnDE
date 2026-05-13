'use client'

import { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-[#0E1110] border border-[#2A312D] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2421]">
          <h2 className="text-[15px] font-bold tracking-[-0.01em]">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938E] hover:text-[#F3F6F4] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div
      className={`flex items-center justify-end gap-2 px-6 py-4 border-t border-[#1F2421] bg-[rgba(255,255,255,0.01)] -mx-6 -mb-5 mt-5 ${className}`}
    >
      {children}
    </div>
  )
}

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-2'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[11.5px]',
    md: 'px-4 py-2 text-[12.5px]',
    lg: 'px-5 py-2.5 text-[13px]',
  }

  const variantClasses = {
    primary: 'bg-[#3DF49A] text-[#06160E] hover:bg-[#5BFBA8] disabled:bg-[#2A312D] disabled:text-[#4A5450]',
    secondary: 'bg-[rgba(255,255,255,0.04)] text-[#F3F6F4] border border-[#2A312D] hover:bg-[rgba(255,255,255,0.08)] hover:border-[#3F4945]',
    danger: 'bg-[#F26B6B] text-white hover:bg-[#F88181] disabled:bg-[#2A312D] disabled:text-[#4A5450]',
    ghost: 'text-[#8A938E] hover:text-[#F3F6F4] hover:bg-[rgba(255,255,255,0.04)]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  )
}
