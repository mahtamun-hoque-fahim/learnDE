'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-utils'

export default function SelectRolePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selected, setSelected] = useState<'student' | 'staff' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3DF49A] mx-auto mb-2"></div>
          <p className="text-[#8A938E]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/sign-in')
    return null
  }

  // If user already has a role, redirect to dashboard
  if (user.role && user.role !== 'student') {
    router.push(user.role === 'admin' ? '/admin' : '/staff')
    return null
  }

  const handleSelect = async (role: 'student' | 'staff') => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error('Failed to set role')
      }

      // Redirect to appropriate dashboard
      router.push(role === 'student' ? '/dashboard' : '/staff')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#070807] to-[#0E1110]">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 border-2 border-[#F3F6F4] rounded-lg flex items-center justify-center font-mono text-xs">
              <span className="flex flex-col items-start gap-px">
                <i>d</i>
                <i style={{ borderTop: '1px solid #F3F6F4', paddingTop: '1px' }}>x</i>
              </span>
            </div>
            <span className="font-bold text-xl">LearnDE</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Welcome, {user.name}!</h1>
          <p className="text-[#8A938E] text-sm">Choose your role to get started</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Student Card */}
          <button
            onClick={() => setSelected('student')}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer text-left ${
              selected === 'student'
                ? 'border-[#3DF49A] bg-[rgba(61,244,154,0.11)]'
                : 'border-[#1F2421] bg-[#0E1110] hover:border-[#2A312D]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">Student</h3>
                <p className="text-[#8A938E] text-sm mt-1">Learn differential equations</p>
              </div>
              <svg
                className={`w-5 h-5 ${
                  selected === 'student' ? 'text-[#3DF49A]' : 'text-[#8A938E]'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <ul className="text-[#8A938E] text-xs space-y-1">
              <li>✓ Read & learn chapters</li>
              <li>✓ Take quizzes</li>
              <li>✓ Earn certificates</li>
            </ul>
          </button>

          {/* Staff Card */}
          <button
            onClick={() => setSelected('staff')}
            className={`p-6 rounded-xl border-2 transition-all cursor-pointer text-left ${
              selected === 'staff'
                ? 'border-[#60A8FA] bg-[rgba(96,168,250,0.11)]'
                : 'border-[#1F2421] bg-[#0E1110] hover:border-[#2A312D]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">Faculty / Moderator</h3>
                <p className="text-[#8A938E] text-sm mt-1">Review & approve submissions</p>
              </div>
              <svg
                className={`w-5 h-5 ${
                  selected === 'staff' ? 'text-[#60A8FA]' : 'text-[#8A938E]'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                <path d="M17.586 5.586a2 2 0 0 0-2.828 0m.707.707a2 2 0 0 1 0 2.828M7.414 5.586a2 2 0 0 1 2.828 0m-.707.707a2 2 0 0 0 0 2.828" />
              </svg>
            </div>
            <ul className="text-[#8A938E] text-xs space-y-1">
              <li>✓ Review submissions</li>
              <li>✓ Write custom quotes</li>
              <li>✓ Manage announcements</li>
            </ul>
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => selected && handleSelect(selected)}
          disabled={!selected || loading}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
            selected && !loading
              ? 'bg-[#3DF49A] text-[#06160E] hover:bg-[#5BFBA8] cursor-pointer'
              : 'bg-[#2A312D] text-[#4A5450] cursor-not-allowed'
          }`}
        >
          {loading ? 'Setting up...' : 'Continue'}
        </button>

        {/* Help Text */}
        <p className="text-center text-[#8A938E] text-xs mt-6">
          You can change your role later in settings
        </p>
      </div>
    </div>
  )
}
