'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Modal, ModalFooter, Button } from './Modal'

interface Submission {
  id: number
  userId: string
  name: string
  email?: string
  university: string
  department: string
  batch: string
  gender: string
  phone?: string
  studentId?: string
  note?: string
  submittedAt: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
}

interface ReviewSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  submission: Submission | null
  onReview: (submissionId: number, action: 'approve' | 'reject' | 'under_review', data: { quoteText?: string; quoteAuthor?: string; rejectReason?: string }) => Promise<void>
}

export function ReviewSubmissionModal({
  isOpen,
  onClose,
  submission,
  onReview,
}: ReviewSubmissionModalProps) {
  const [action, setAction] = useState<'approve' | 'reject' | 'under_review' | null>(null)
  const [quoteText, setQuoteText] = useState('')
  const [quoteAuthor, setQuoteAuthor] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(false)

  if (!submission) return null

  const handleSubmit = async () => {
    if (!action) return

    if (action === 'approve' && (!quoteText || !quoteAuthor)) {
      toast.error('Please provide a quote and author name')
      return
    }

    if (action === 'reject' && !rejectReason) {
      toast.error('Please provide a rejection reason')
      return
    }

    setLoading(true)
    const toastId = toast.loading(
      action === 'approve' 
        ? 'Approving submission...' 
        : action === 'reject' 
          ? 'Rejecting submission...' 
          : 'Updating status...'
    )
    
    try {
      await onReview(submission.id, action, {
        quoteText: action === 'approve' ? quoteText : undefined,
        quoteAuthor: action === 'approve' ? quoteAuthor : undefined,
        rejectReason: action === 'reject' ? rejectReason : undefined,
      })
      
      toast.success(
        action === 'approve' 
          ? 'Certificate approved and email sent!' 
          : action === 'reject' 
            ? 'Submission rejected and email sent' 
            : 'Status updated successfully',
        { id: toastId }
      )
      
      onClose()
      // Reset form
      setAction(null)
      setQuoteText('')
      setQuoteAuthor('')
      setRejectReason('')
    } catch (error) {
      console.error('Review error:', error)
      toast.error('Failed to submit review. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setAction(null)
      setQuoteText('')
      setQuoteAuthor('')
      setRejectReason('')
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Review Certificate Submission"
      size="lg"
    >
      {/* Student Info */}
      <div className="space-y-4">
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[#1F2421] rounded-lg">
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div>
              <div className="text-[#8A938E] mb-0.5">Student Name</div>
              <div className="font-semibold">{submission.name}</div>
            </div>
            {submission.email && (
              <div>
                <div className="text-[#8A938E] mb-0.5">Email</div>
                <div className="font-semibold">{submission.email}</div>
              </div>
            )}
            <div>
              <div className="text-[#8A938E] mb-0.5">University</div>
              <div className="font-semibold">{submission.university}</div>
            </div>
            <div>
              <div className="text-[#8A938E] mb-0.5">Department</div>
              <div className="font-semibold">{submission.department}</div>
            </div>
            <div>
              <div className="text-[#8A938E] mb-0.5">Batch</div>
              <div className="font-semibold">{submission.batch}</div>
            </div>
            <div>
              <div className="text-[#8A938E] mb-0.5">Gender</div>
              <div className="font-semibold capitalize">{submission.gender}</div>
            </div>
            {submission.phone && (
              <div>
                <div className="text-[#8A938E] mb-0.5">Phone</div>
                <div className="font-semibold">{submission.phone}</div>
              </div>
            )}
            {submission.studentId && (
              <div>
                <div className="text-[#8A938E] mb-0.5">Student ID</div>
                <div className="font-semibold">{submission.studentId}</div>
              </div>
            )}
          </div>
          {submission.note && (
            <div className="mt-3 pt-3 border-t border-[#1F2421]">
              <div className="text-[#8A938E] text-[11px] mb-1">Student Note</div>
              <div className="text-[12px] italic">&quot;{submission.note}&quot;</div>
            </div>
          )}
        </div>

        {/* Action Selection */}
        <div>
          <div className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] mb-2">
            Review Action
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setAction('under_review')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                action === 'under_review'
                  ? 'border-[#60A8FA] bg-[rgba(96,168,250,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Mark Under Review</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Need more time</div>
            </button>
            <button
              onClick={() => setAction('approve')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                action === 'approve'
                  ? 'border-[#3DF49A] bg-[rgba(61,244,154,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Approve</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Issue certificate</div>
            </button>
            <button
              onClick={() => setAction('reject')}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                action === 'reject'
                  ? 'border-[#F26B6B] bg-[rgba(242,107,107,0.11)]'
                  : 'border-[#2A312D] hover:border-[#3F4945]'
              }`}
            >
              <div className="text-[12px] font-semibold">Reject</div>
              <div className="text-[10px] text-[#8A938E] mt-0.5">Send back</div>
            </button>
          </div>
        </div>

        {/* Quote Input (Approve) */}
        {action === 'approve' && (
          <div className="space-y-3 p-4 bg-[rgba(61,244,154,0.05)] border border-[rgba(61,244,154,0.15)] rounded-lg">
            <div>
              <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-1.5">
                Personal Quote *
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Write a personalized quote for the student..."
                className="w-full px-3 py-2.5 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#3DF49A] focus:ring-4 focus:ring-[rgba(61,244,154,0.08)] transition-all resize-none"
                rows={3}
              />
              <div className="text-[10px] text-[#8A938E] mt-1">
                Tip: Make it personal, inspiring, and memorable
              </div>
            </div>
            <div>
              <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-1.5">
                Quote Author (Your Name) *
              </label>
              <input
                type="text"
                value={quoteAuthor}
                onChange={(e) => setQuoteAuthor(e.target.value)}
                placeholder="e.g., Dr. Rohit Das"
                className="w-full px-3 py-2 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#3DF49A] focus:ring-4 focus:ring-[rgba(61,244,154,0.08)] transition-all"
              />
            </div>
          </div>
        )}

        {/* Reject Reason (Reject) */}
        {action === 'reject' && (
          <div className="p-4 bg-[rgba(242,107,107,0.05)] border border-[rgba(242,107,107,0.15)] rounded-lg">
            <label className="text-[11.5px] text-[#8A938E] uppercase tracking-[0.08em] block mb-1.5">
              Rejection Reason *
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why the submission was rejected..."
              className="w-full px-3 py-2.5 bg-[#0B0F0D] border border-[#2A312D] rounded-lg text-[12.5px] focus:outline-none focus:border-[#F26B6B] focus:ring-4 focus:ring-[rgba(242,107,107,0.08)] transition-all resize-none"
              rows={3}
            />
            <div className="text-[10px] text-[#8A938E] mt-1">
              Be clear and constructive. The student will see this message.
            </div>
          </div>
        )}
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={action === 'approve' ? 'primary' : action === 'reject' ? 'danger' : 'secondary'}
          onClick={handleSubmit}
          disabled={!action || loading}
        >
          {loading ? 'Submitting...' : action === 'approve' ? 'Approve & Issue Certificate' : action === 'reject' ? 'Reject Submission' : 'Mark Under Review'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
