'use client'

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#0E1110] border border-[#1F2421] rounded-[12px] p-5 ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  action?: React.ReactNode
  subtitle?: string
}

export function CardHeader({ title, action, subtitle }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3.5 mb-3.5">
      <div>
        <h3 className="text-[12.5px] font-bold tracking-[-0.01em]">{title}</h3>
        {subtitle && <p className="text-[11px] text-[#8A938E] mt-1">{subtitle}</p>}
      </div>
      {action && <div className="text-[11.5px] text-[#8A938E] hover:opacity-75 transition-opacity cursor-pointer">{action}</div>}
    </div>
  )
}

interface ContinueCardProps {
  title: string
  subtitle: string
  progress: number
  progressColor?: 'mint' | 'blue' | 'amber' | 'rose'
  button: React.ReactNode
}

export function ContinueCard({ title, subtitle, progress, progressColor = 'mint', button }: ContinueCardProps) {
  const getBgGradient = () => {
    switch (progressColor) {
      case 'mint':
        return 'from-[#0A1410] to-[#0D1A13]'
      case 'blue':
        return 'from-[#050E18] to-[#0D1520]'
      case 'amber':
        return 'from-[#18140A] to-[#1A1510]'
      case 'rose':
        return 'from-[#18050A] to-[#1A0F15]'
      default:
        return 'from-[#0A1410] to-[#0D1A13]'
    }
  }

  const getBorderColor = () => {
    switch (progressColor) {
      case 'mint':
        return 'rgba(61, 244, 154, 0.18)'
      case 'blue':
        return 'rgba(96, 168, 250, 0.18)'
      case 'amber':
        return 'rgba(245, 168, 92, 0.18)'
      case 'rose':
        return 'rgba(242, 107, 107, 0.18)'
      default:
        return 'rgba(61, 244, 154, 0.18)'
    }
  }

  const getBarColor = () => {
    switch (progressColor) {
      case 'mint':
        return '#3DF49A'
      case 'blue':
        return '#60A8FA'
      case 'amber':
        return '#F5A85C'
      case 'rose':
        return '#F26B6B'
      default:
        return '#3DF49A'
    }
  }

  const getDotColor = () => {
    switch (progressColor) {
      case 'mint':
        return 'rgba(61, 244, 154, 0.05)'
      case 'blue':
        return 'rgba(96, 168, 250, 0.05)'
      case 'amber':
        return 'rgba(245, 168, 92, 0.05)'
      case 'rose':
        return 'rgba(242, 107, 107, 0.05)'
      default:
        return 'rgba(61, 244, 154, 0.05)'
    }
  }

  return (
    <div
      className={`bg-gradient-to-br ${getBgGradient()} border rounded-[12px] p-5 mb-3.5 relative overflow-hidden`}
      style={{ borderColor: getBorderColor() }}
    >
      {/* Gradient dot */}
      <div
        className="absolute -right-[50px] -top-[50px] w-[180px] h-[180px] rounded-full pointer-events-none"
        style={{ backgroundColor: getDotColor() }}
      />

      <div className="relative z-10">
        <div className="text-[10px] text-[#3DF49A] uppercase tracking-[0.14em] mb-1.5">Continue learning</div>
        <h3 className="text-[16px] font-bold tracking-[-0.02em] mb-1.25">{title}</h3>
        <p className="text-[12px] text-[#8A938E] mb-3.5 leading-relaxed">{subtitle}</p>

        {/* Progress bar */}
        <div className="mb-1.5">
          <div className="h-[5px] bg-[#1F2421] rounded-[3px] overflow-hidden">
            <div
              className="h-full rounded-[3px] transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: getBarColor() }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#8A938E]">{progress}% complete</span>
          <div>{button}</div>
        </div>
      </div>
    </div>
  )
}
