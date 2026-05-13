'use client'

import { useState } from 'react'
import { Modal, ModalFooter, Button } from './Modal'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'staff' | 'admin'
  active?: boolean
  createdAt?: string
}

interface UserEditModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSave: (userId: string, updates: { role?: string; active?: boolean }) => Promise<void>
}

export function UserEditModal({
  isOpen,
  onClose,
  user,
  onSave,
}: UserEditModalProps) {
  const [role, setRole] = useState<'student' | 'staff' | 'admin'>(user?.role || 'student')
  const [active, setActive] = useState(user?.active !== false)
  const [loading, setLoading] = useState(false)

  // Update local state when user prop changes
  if (user && (role !== user.role || active !== (user.active !== false))) {
    setRole(user.role)
    setActive(user.active !== false)
  }

  if (!user) return null

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSave(user.id, { role, active })
      onClose()
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = role !== user.role || active !== (user.active !== false)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      size="md"
    >
      <div className="space-y-4">
        {/* User Info (Read-only) */}
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[#1F2421] rounded-lg">
          <div className="space-y-2 text-[12px]">
            <div>
              <div className="text-[#8A938E] mb-0.5">Name</div>
              <div className="font-semibold">{user.name}</div>
            </div>
            <div>
              <div className="text-[#8A938E] mb-0.5">Email</div>
              <div className="font-semibold">{user.email}</div>
            </div>
            {user.createdAt && (
              <div>
                <div className="text-[#8A938E] mb-0.5">Member Since</div>
                <div className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-2">
            User Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setRole('student')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                role === 'student'
                  ? 'border-[#3DF49A] bg-[rgba(61,244,154,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Student</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Read & quiz</div>
            </button>
            <button
              onClick={() => setRole('staff')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                role === 'staff'
                  ? 'border-[#60A8FA] bg-[rgba(96,168,250,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Faculty</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Review certs</div>
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                role === 'admin'
                  ? 'border-[#F5A85C] bg-[rgba(245,168,92,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Admin</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Full access</div>
            </button>
          </div>
        </div>

        {/* Active Status Toggle */}
        <div>
          <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-2">
            Account Status
          </label>
          <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] border border-[#1F2421] rounded-lg">
            <div>
              <div className="text-[12.5px] font-semibold">
                {active ? 'Active' : 'Suspended'}
              </div>
              <div className="text-[11px] text-[#8A938E]">
                {active ? 'User can access the platform' : 'User cannot sign in'}
              </div>
            </div>
            <button
              onClick={() => setActive(!active)}
              className={`relative w-11 h-6 rounded-full transition-all ${
                active ? 'bg-[#3DF49A]' : 'bg-[#2A312D]'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                  active ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Warning for Admin Role */}
        {role === 'admin' && user.role !== 'admin' && (
          <div className="p-3 bg-[rgba(245,168,92,0.08)] border border-[rgba(245,168,92,0.2)] rounded-lg">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-[#F5A85C] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-[11px]">
                <div className="font-semibold text-[#F5A85C]">Granting Admin Access</div>
                <div className="text-[#8A938E] mt-0.5">
                  This user will have full access to manage users, staff, courses, and system settings.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning for Suspending User */}
        {!active && user.active !== false && (
          <div className="p-3 bg-[rgba(242,107,107,0.08)] border border-[rgba(242,107,107,0.2)] rounded-lg">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-[#F26B6B] flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-[11px]">
                <div className="font-semibold text-[#F26B6B]">Suspending Account</div>
                <div className="text-[#8A938E] mt-0.5">
                  This user will be logged out and cannot access the platform until reactivated.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!hasChanges || loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
