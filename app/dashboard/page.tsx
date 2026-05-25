'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Greeting } from '@/app/components/dashboard/Greeting'
import { StatsRow } from '@/app/components/dashboard/StatsRow'
import { Card, CardHeader, ContinueCard } from '@/app/components/dashboard/Cards'
import { getStudentNavItems } from '@/lib/nav-items'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface DashboardData {
  stats: {
    chaptersRead: number
    totalChapters: number
    quizzesPassed: number
    totalQuizzes: number
    overallProgress: number
    streak: number
    deltas: {
      chaptersRead: number
      quizzesPassed: number
      overallProgress: number
    }
  }
  continueData: {
    chapterNum: number
    title: string
    slug: string
    progress: number
  } | null
  chapters: Array<{
    num: number
    slug: string
    title: string
    status: 'completed' | 'reading' | 'unread'
    quiz: 'passed' | 'failed' | 'untaken'
  }>
  recentQuizzes: Array<{
    ch: number
    score: number
    status: 'passed' | 'failed'
    date: string
  }>
  certStatus: {
    canApply: boolean
    submitted: boolean
    status: string | null
  }
}

export default function StudentDashboard() {
  const { role, name, isLoading, isSignedIn } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!isSignedIn || role !== 'student')) {
      router.push('/login')
    }
  }, [isLoading, isSignedIn, role, router])

  // Fetch dashboard data
  useEffect(() => {
    if (isSignedIn && role === 'student') {
      fetchDashboardData()
    }
  }, [isSignedIn, role])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/student/dashboard')
      
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const dashboardData = await res.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || role !== 'student') {
    return null
  }

  if (loading || !data) {
    return (
      <DashboardLayout
        title="My Dashboard"
        subtitle="BSc CSE · 2nd Semester"
        navItems={[]}
        role="student"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-[#8A938E]">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  const navItems: NavItem[] = getStudentNavItems({
    pendingQuizzes: data.stats.totalQuizzes - data.stats.quizzesPassed,
  })

  const formatDelta = (n: number, suffix = '') => {
    if (n === 0) return { value: 'No change', positive: true }
    const sign = n > 0 ? '+' : ''
    return { value: `${sign}${n}${suffix}`, positive: n >= 0 }
  }

  const streakDelta =
    data.stats.streak === 0
      ? { value: 'Start one!', positive: false }
      : data.stats.streak === 1
        ? { value: 'Day 1', positive: true }
        : { value: `${data.stats.streak} day run`, positive: true }

  const stats = [
    {
      label: 'Chapters Read',
      value: String(data.stats.chaptersRead),
      unit: `/ ${data.stats.totalChapters}`,
      color: 'mint' as const,
      delta: formatDelta(data.stats.deltas.chaptersRead),
    },
    {
      label: 'Quizzes Passed',
      value: String(data.stats.quizzesPassed),
      unit: `/ ${data.stats.totalQuizzes}`,
      color: 'blue' as const,
      delta: formatDelta(data.stats.deltas.quizzesPassed),
    },
    {
      label: 'Overall Progress',
      value: String(data.stats.overallProgress),
      unit: '%',
      color: 'amber' as const,
      delta: formatDelta(data.stats.deltas.overallProgress, '%'),
    },
    {
      label: 'Streak',
      value: String(data.stats.streak),
      unit: 'days',
      color: 'rose' as const,
      delta: streakDelta,
    },
  ]

  return (
    <DashboardLayout
      title="My Dashboard"
      subtitle="BSc CSE · 2nd Semester"
      navItems={navItems}
      role="student"
    >
      {/* Greeting */}
      <Greeting 
        name={name || 'Student'} 
        subtitle={`You're ${data.stats.overallProgress}% through the course`} 
      />

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Continue Learning Card */}
      {data.continueData && (
        <ContinueCard
          title={`Chapter ${data.continueData.chapterNum}: ${data.continueData.title}`}
          subtitle="Continue where you left off."
          progress={data.continueData.progress}
          progressColor="mint"
          button={
            <a
              href={`/learn/${data.continueData.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3DF49A] text-[#06160E] rounded-lg font-semibold text-[12.5px] hover:bg-[#5BFBA8] transition-colors"
            >
              Continue
            </a>
          }
        />
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Chapters Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Chapters"
              action={<a href="/learn" className="text-[#3DF49A]">View all →</a>}
            />
            <div className="space-y-2">
              {data.chapters.slice(0, 5).map((ch) => (
                <div
                  key={ch.num}
                  className="flex items-center gap-2.5 px-3 py-2.25 border-b border-[#1F2421] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold">Chapter {ch.num}</div>
                    <div className="text-[11px] text-[#8A938E]">{ch.title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ch.status === 'completed'
                          ? 'bg-[rgba(61,244,154,0.12)] text-[#3DF49A]'
                          : ch.status === 'reading'
                          ? 'bg-[rgba(96,168,250,0.12)] text-[#60A8FA]'
                          : 'bg-[rgba(255,255,255,0.05)] text-[#8A938E]'
                      }`}
                    >
                      {ch.status === 'completed' ? 'Read' : ch.status === 'reading' ? 'Reading' : 'Unread'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ch.quiz === 'passed'
                          ? 'bg-[rgba(61,244,154,0.12)] text-[#3DF49A]'
                          : ch.quiz === 'failed'
                          ? 'bg-[rgba(242,107,107,0.12)] text-[#F26B6B]'
                          : 'bg-[rgba(255,255,255,0.05)] text-[#8A938E]'
                      }`}
                    >
                      {ch.quiz === 'passed' ? 'Passed' : ch.quiz === 'failed' ? 'Failed' : 'Untaken'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Quiz Attempts */}
        <div>
          <Card>
            <CardHeader title="Recent Quizzes" />
            <div className="space-y-2.5">
              {data.recentQuizzes.length > 0 ? (
                data.recentQuizzes.map((quiz, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[12.5px] font-bold text-[#8A938E]">
                      {quiz.ch}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold">Chapter {quiz.ch}</div>
                      <div className="text-[11px] text-[#8A938E]">{quiz.date}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[12.5px] font-bold ${
                        quiz.status === 'passed' ? 'text-[#3DF49A]' : 'text-[#F26B6B]'
                      }`}>
                        {quiz.score}%
                      </div>
                      <div className={`text-[10px] font-semibold ${
                        quiz.status === 'passed' ? 'text-[#3DF49A]' : 'text-[#F26B6B]'
                      }`}>
                        {quiz.status === 'passed' ? 'Passed' : 'Failed'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-[#8A938E] text-[12.5px]">
                  No quiz attempts yet
                </div>
              )}
            </div>
          </Card>

          {/* Certificate Status */}
          <Card className="mt-3.5">
            <CardHeader title="Certificate" />
            <div className="space-y-2.5">
              {data.certStatus.canApply && !data.certStatus.submitted && (
                <div className="text-[12.5px] text-[#8A938E] mb-3">
                  You've completed all requirements!
                </div>
              )}
              
              {data.certStatus.submitted && (
                <div className={`px-3 py-2 rounded-lg ${
                  data.certStatus.status === 'approved'
                    ? 'bg-[rgba(61,244,154,0.12)] border border-[rgba(61,244,154,0.2)]'
                    : data.certStatus.status === 'pending'
                    ? 'bg-[rgba(245,168,92,0.12)] border border-[rgba(245,168,92,0.2)]'
                    : data.certStatus.status === 'under_review'
                    ? 'bg-[rgba(96,168,250,0.12)] border border-[rgba(96,168,250,0.2)]'
                    : 'bg-[rgba(242,107,107,0.12)] border border-[rgba(242,107,107,0.2)]'
                }`}>
                  <div className={`text-[12.5px] font-semibold mb-0.5 ${
                    data.certStatus.status === 'approved'
                      ? 'text-[#3DF49A]'
                      : data.certStatus.status === 'pending'
                      ? 'text-[#F5A85C]'
                      : data.certStatus.status === 'under_review'
                      ? 'text-[#60A8FA]'
                      : 'text-[#F26B6B]'
                  }`}>
                    {data.certStatus.status === 'approved' && 'Certificate Approved'}
                    {data.certStatus.status === 'pending' && 'Under Review'}
                    {data.certStatus.status === 'under_review' && 'Being Reviewed'}
                    {data.certStatus.status === 'rejected' && 'Needs Attention'}
                  </div>
                  <div className="text-[11px] text-[#8A938E]">
                    {data.certStatus.status === 'approved' && 'Your certificate is ready!'}
                    {data.certStatus.status === 'pending' && 'Staff will review soon'}
                    {data.certStatus.status === 'under_review' && 'Staff is reviewing your work'}
                    {data.certStatus.status === 'rejected' && 'Check your email for details'}
                  </div>
                </div>
              )}

              {data.certStatus.canApply && !data.certStatus.submitted && (
                <a
                  href="/certificate/apply"
                  className="block w-full text-center px-4 py-2 bg-[#3DF49A] text-[#06160E] rounded-lg font-semibold text-[12.5px] hover:bg-[#5BFBA8] transition-colors"
                >
                  Apply for Certificate
                </a>
              )}
              
              {!data.certStatus.canApply && !data.certStatus.submitted && (
                <div className="text-center py-4 text-[#8A938E] text-[11px]">
                  Complete all chapters and quizzes to apply
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
