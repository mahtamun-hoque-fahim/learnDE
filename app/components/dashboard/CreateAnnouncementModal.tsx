'use client'

import { useState } from 'react'
import { Modal, ModalFooter, Button } from './Modal'

interface CreateAnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (announcement: {
    title: string
    content: string
    targetRole: 'all' | 'student' | 'staff'
    scheduledAt?: string
  }) => Promise<void>
}

export function CreateAnnouncementModal({
  isOpen,
  onClose,
  onCreate,
}: CreateAnnouncementModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetRole, setTargetRole] = useState<'all' | 'student' | 'staff'>('student')
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('Please fill in title and content')
      return
    }

    if (scheduleType === 'later' && (!scheduledDate || !scheduledTime)) {
      alert('Please select a date and time for scheduled announcement')
      return
    }

    setLoading(true)
    try {
      const scheduledAt = scheduleType === 'later' 
        ? `${scheduledDate}T${scheduledTime}:00`
        : undefined

      await onCreate({
        title,
        content,
        targetRole,
        scheduledAt,
      })

      // Reset form
      setTitle('')
      setContent('')
      setTargetRole('student')
      setScheduleType('now')
      setScheduledDate('')
      setScheduledTime('')
      onClose()
    } catch (error) {
      console.error('Create error:', error)
      alert('Failed to create announcement. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setTitle('')
      setContent('')
      setTargetRole('student')
      setScheduleType('now')
      setScheduledDate('')
      setScheduledTime('')
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Announcement"
      size="lg"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Office Hours Update"
            className="w-full px-3 py-2 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#3DF49A] focus:ring-4 focus:ring-[rgba(61,244,154,0.08)] transition-all"
            maxLength={100}
          />
          <div className="text-[10px] text-[#8A938E] mt-1">
            {title.length}/100 characters
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-1.5">
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your announcement here..."
            className="w-full px-3 py-2.5 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#3DF49A] focus:ring-4 focus:ring-[rgba(61,244,154,0.08)] transition-all resize-none"
            rows={6}
          />
          <div className="text-[10px] text-[#8A938E] mt-1">
            Supports basic markdown: **bold**, *italic*, [link](url)
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-2">
            Send To
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTargetRole('student')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                targetRole === 'student'
                  ? 'border-[#3DF49A] bg-[rgba(61,244,154,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Students</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">All students</div>
            </button>
            <button
              onClick={() => setTargetRole('staff')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                targetRole === 'staff'
                  ? 'border-[#60A8FA] bg-[rgba(96,168,250,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Staff</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Faculty only</div>
            </button>
            <button
              onClick={() => setTargetRole('all')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                targetRole === 'all'
                  ? 'border-[#F5A85C] bg-[rgba(245,168,92,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Everyone</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">All users</div>
            </button>
          </div>
        </div>

        {/* Schedule Type */}
        <div>
          <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-2">
            Publish
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setScheduleType('now')}
              className={`p-3 rounded-lg border-2 transition-all ${
                scheduleType === 'now'
                  ? 'border-[#3DF49A] bg-[rgba(61,244,154,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Immediately</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Publish now</div>
            </button>
            <button
              onClick={() => setScheduleType('later')}
              className={`p-3 rounded-lg border-2 transition-all ${
                scheduleType === 'later'
                  ? 'border-[#3DF49A] bg-[rgba(61,244,154,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Schedule</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Pick date/time</div>
            </button>
          </div>
        </div>

        {/* Scheduled Date/Time */}
        {scheduleType === 'later' && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-[rgba(61,244,154,0.05)] border border-[rgba(61,244,154,0.15)] rounded-lg">
            <div>
              <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#3DF49A] focus:ring-4 focus:ring-[rgba(61,244,154,0.08)] transition-all"
              />
            </div>
            <div>
              <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-1.5">
                Time *
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#3DF49A] focus:ring-4 focus:ring-[rgba(61,244,154,0.08)] transition-all"
              />
            </div>
          </div>
        )}

        {/* Preview */}
        {(title || content) && (
          <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[#1F2421] rounded-lg">
            <div className="text-[10px] text-[#8A938E] uppercase tracking-[0.08em] mb-2">
              Preview
            </div>
            <div className="space-y-2">
              {title && (
                <div className="text-[14px] font-bold">{title}</div>
              )}
              {content && (
                <div className="text-[12px] text-[#8A938E] whitespace-pre-wrap">
                  {content}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!title || !content || loading}
        >
          {loading ? 'Creating...' : scheduleType === 'now' ? 'Publish Announcement' : 'Schedule Announcement'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
