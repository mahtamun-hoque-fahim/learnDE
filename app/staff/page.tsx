'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Greeting } from '@/app/components/dashboard/Greeting'
import { StatsRow } from '@/app/components/dashboard/StatsRow'
import { Card, CardHeader } from '@/app/components/dashboard/Cards'
import { ReviewSubmissionModal, type Submission } from '@/app/components/dashboard/ReviewSubmissionModal'
import {
  IconHome,
  IconUsers,
  IconBook,
  IconQuiz,
  IconAnnouncements,
  IconAnalytics,
} from '@/app/components/dashboard/Icons'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface StaffData {
  stats: {
    pending: number
    underReview: number
    approved: number
    thisMonth: number
  }
  submissions: Submission[]
}

export default function StaffDashboard() {
  const { role, name, isLoading, isSignedIn } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<StaffData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isSignedIn || (role !== 'staff' && role !== 'admin'))) {
      router.push('/login')
    }
  }, [isLoading, isSignedIn, role, router])

  useEffect(() => {
    if (isSignedIn && (role === 'staff' || role === 'admin')) {
      fetchSubmissions()
    }
  }, [isSignedIn, role])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/staff/submissions')
      
      if (!res.ok) {
        throw new Error('Failed to fetch submissions')
      }
      
      const submissionsData = await res.json()
      setData(submissionsData)
    } catch (error) {
      console.error('Submissions fetch error:', error)
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewClick = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsModalOpen(true)
  }

  const handleReview = async (
    submissionId: number,
    action: 'approve' | 'reject' | 'under_review',
    reviewData: { quoteText?: string; quoteAuthor?: string; rejectReason?: string }
  ) => {
    try {
      const res = await fetch('/api/staff/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          action,
          quoteText: reviewData.quoteText,
          quoteAuthor: reviewData.quoteAuthor,
          reviewNote: reviewData.rejectReason,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit review')
      }

      // Refresh submissions list
      await fetchSubmissions()
    } catch (error) {
      console.error('Review submission error:', error)
      throw error // Let modal handle the error
    }
  }

  if (isLoading || (role !== 'staff' && role !== 'admin')) {
    return null
  }

  if (loading || !data) {
    return (
      <DashboardLayout
        title="Staff Dashboard"
        subtitle="Certificate Management"
        navItems={[]}
        role="staff"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-[#8A938E]">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      href: '/staff',
      icon: <IconHome />,
      active: true,
    },
    {
      label: 'Students',
      href: '/staff?tab=students',
      icon: <IconUsers />,
    },
    {
      label: 'Chapters',
      href: '/staff?tab=chapters',
      icon: <IconBook />,
    },
    {
      label: 'Quizzes',
      href: '/staff?tab=quizzes',
      icon: <IconQuiz />,
    },
    {
      label: 'Announcements',
      href: '/staff?tab=announcements',
      icon: <IconAnnouncements />,
    },
    {
      label: 'Reports',
      href: '/staff?tab=reports',
      icon: <IconAnalytics />,
    },
  ]

  const stats = [
    {
      label: 'Pending Submissions',
      value: String(data.stats.pending),
      color: 'mint' as const,
      delta: { value: '+2', positive: true },
    },
    {
      label: 'Under Review',
      value: String(data.stats.underReview),
      color: 'blue' as const,
      delta: { value: '2 hrs avg', positive: false },
    },
    {
      label: 'Approved',
      value: String(data.stats.approved),
      color: 'amber' as const,
      delta: { value: '+3', positive: true },
    },
    {
      label: 'This Month',
      value: String(data.stats.thisMonth),
      color: 'rose' as const,
      delta: { value: '+8', positive: true },
    },
  ]

  return (
    <>
      <DashboardLayout
        title="Staff Dashboard"
        subtitle="Certificate Management"
        navItems={navItems}
        role="staff"
      >
        <Greeting 
          name={name || 'Staff'} 
          subtitle="Review student certificate submissions" 
        />

        <StatsRow stats={stats} />

        {/* Pending Submissions */}
        <Card>
          <CardHeader
            title="Pending Submissions"
            subtitle={`${data.stats.pending} awaiting review`}
          />
          <div className="space-y-2">
            {data.submissions.filter(s => s.status === 'pending').length > 0 ? (
              data.submissions
                .filter(s => s.status === 'pending')
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center gap-3 px-3 py-2.5 border-b border-[#1F2421] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold">{submission.displayName}</div>
                      <div className="text-[11px] text-[#8A938E]">
                        {submission.university} • {submission.department}
                      </div>
                      <div className="text-[10.5px] text-[#6B7470] mt-0.5">
                        Submitted {submission.submittedAgo}
                      </div>
                    </div>
                    <button
                      onClick={() => handleReviewClick(submission)}
                      className="px-3 py-1.5 bg-[#3DF49A] text-[#06160E] rounded-lg font-semibold text-[11.5px] hover:bg-[#5BFBA8] transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-[#8A938E] text-[12.5px]">
                No pending submissions
              </div>
            )}
          </div>
        </Card>

        {/* Under Review */}
        {data.submissions.filter(s => s.status === 'under_review').length > 0 && (
          <Card className="mt-3.5">
            <CardHeader
              title="Under Review"
              subtitle={`${data.stats.underReview} in progress`}
            />
            <div className="space-y-2">
              {data.submissions
                .filter(s => s.status === 'under_review')
                .map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center gap-3 px-3 py-2.5 border-b border-[#1F2421] last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold">{submission.displayName}</div>
                      <div className="text-[11px] text-[#8A938E]">
                        {submission.university}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[rgba(96,168,250,0.12)] text-[#60A8FA]">
                      Under Review
                    </span>
                    <button
                      onClick={() => handleReviewClick(submission)}
                      className="px-3 py-1.5 bg-[rgba(255,255,255,0.05)] text-[#F3F6F4] rounded-lg font-semibold text-[11.5px] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Recent Approved */}
        <Card className="mt-3.5">
          <CardHeader
            title="Recently Approved"
            subtitle="Last 5 approvals"
          />
          <div className="space-y-2">
            {data.submissions
              .filter(s => s.status === 'approved')
              .slice(0, 5)
              .map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center gap-3 px-3 py-2.5 border-b border-[#1F2421] last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold">{submission.displayName}</div>
                    <div className="text-[11px] text-[#8A938E]">
                      {submission.university}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[rgba(61,244,154,0.12)] text-[#3DF49A]">
                    Approved
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </DashboardLayout>

      {/* Review Modal */}
      <ReviewSubmissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedSubmission(null)
        }}
        submission={selectedSubmission}
        onReview={handleReview}
      />
    </>
  )
}
