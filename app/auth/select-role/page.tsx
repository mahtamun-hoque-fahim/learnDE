'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SelectRolePage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [selected, setSelected] = useState<'student' | 'staff' | null>(null)
  const [loading, setLoading] = useState(false)

  if (!isLoaded || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If user already has a role, redirect to appropriate dashboard
  if (user.publicMetadata?.role) {
    router.push(user.publicMetadata.role === 'admin' ? '/admin' : '/dashboard')
    return null
  }

  const handleSelect = async (role: 'student' | 'staff') => {
    setLoading(true)
    try {
      await user.update({
        unsafeMetadata: {
          role,
        },
      })
      // Update public metadata via Clerk user update
      await user.update({
        publicMetadata: {
          role,
        },
      })
      router.push(role === 'student' ? '/dashboard' : '/staff')
    } catch (error) {
      console.error('Failed to set role:', error)
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
          <h1 className="text-3xl font-bold mb-3">Welcome to LearnDE</h1>
          <p className="text-[#8A938E] text-sm">Choose your role to get started</p>
        </div>

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
