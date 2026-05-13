'use client'

import { useAuth } from '@/lib/auth-utils'
import { UserButton, SignOutButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  navItems: NavItem[]
  role: 'student' | 'staff' | 'admin'
}

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: number | string
  badgeColor?: 'mint' | 'red' | 'amber'
  active?: boolean
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  navItems,
  role,
}: DashboardLayoutProps) {
  const { user, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070807]">
        <div className="animate-spin w-8 h-8 border-2 border-[#3DF49A] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#070807] text-[#F3F6F4]">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-[#0E1110] border-r border-[#1F2421] flex flex-col z-50">
        {/* Brand */}
        <div className="px-4 py-[18px] border-b border-[#1F2421] flex items-center gap-2.5">
          <div className="w-8 h-8 border-[1.5px] border-[#F3F6F4] rounded-[9px] flex items-center justify-center font-mono text-[9px] relative flex-shrink-0">
            <span className="flex flex-col items-start gap-px leading-none">
              <i>d</i>
              <i style={{ borderTop: '1px solid #F3F6F4', paddingTop: '1px', marginTop: '1px' }}>x</i>
            </span>
            <span className="absolute text-[#3DF49A] text-[15px] right-[2px] top-[-3px]">·</span>
          </div>
          <span className="font-bold text-[14.5px] tracking-[-0.02em]">LearnDE</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-px">
          <div className="text-[9.5px] text-[#4A5450] uppercase tracking-[0.14em] px-2 py-2.5 mt-1">
            Main menu
          </div>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className={`flex items-center gap-[9px] px-[10px] py-2 rounded-lg text-[13px] transition-all border border-transparent ${
                item.active
                  ? 'text-[#F3F6F4] bg-[rgba(61,244,154,0.11)] border-[rgba(61,244,154,0.22)]'
                  : 'text-[#8A938E] hover:text-[#F3F6F4] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <span className={`w-[15px] h-[15px] flex-shrink-0 ${item.active ? 'text-[#3DF49A]' : 'opacity-75'}`}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={`ml-auto text-[10px] font-bold px-1.5 py-px rounded-full ${
                    item.badgeColor === 'red'
                      ? 'bg-[rgba(242,107,107,0.1)] text-[#F26B6B]'
                      : item.badgeColor === 'amber'
                        ? 'bg-[rgba(245,168,92,0.1)] text-[#F5A85C]'
                        : 'bg-[rgba(61,244,154,0.11)] text-[#3DF49A]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-3.5 py-3 border-t border-[#1F2421] flex items-center gap-2.25">
          <div className="w-[30px] h-[30px] rounded-full bg-[rgba(61,244,154,0.11)] border border-[rgba(61,244,154,0.22)] flex items-center justify-center text-[11px] font-bold text-[#3DF49A] flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold truncate">
              {user?.fullName || user?.firstName || 'User'}
            </div>
            <div className="text-[10.5px] text-[#8A938E]">
              {role === 'student' ? 'Student' : role === 'staff' ? 'Faculty' : 'Administrator'}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-[220px] flex flex-col">
        {/* TOP BAR */}
        <header className="h-[58px] border-b border-[#1F2421] flex items-center px-6 gap-3.5 bg-[rgba(7,8,7,0.85)] backdrop-blur-[12px] sticky top-0 z-40 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-[14px] font-bold tracking-[-0.02em]">{title}</h1>
            <span className="text-[11.5px] text-[#8A938E] ml-2 inline-block font-normal">
              {subtitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="w-[34px] h-[34px] rounded-lg border border-[#2A312D] flex items-center justify-center text-[#8A938E] hover:text-[#F3F6F4] hover:bg-[rgba(255,255,255,0.04)] transition-all relative">
              <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 0 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User Menu */}
            <UserButton afterSignOutUrl="/auth/sign-in" />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
