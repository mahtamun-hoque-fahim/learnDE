'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Greeting } from '@/app/components/dashboard/Greeting'
import { StatsRow } from '@/app/components/dashboard/StatsRow'
import { Card, CardHeader } from '@/app/components/dashboard/Cards'
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
import { useEffect } from 'react'

export default function StaffDashboard() {
  const { role, name, isLoading, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isSignedIn || (role !== 'staff' && role !== 'admin'))) {
      router.push('/auth/sign-in')
    }
  }, [isLoading, isSignedIn, role, router])

  if (isLoading || (role !== 'staff' && role !== 'admin')) {
    return null
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
      badge: '1',
      badgeColor: 'amber',
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
      value: '5',
      color: 'mint' as const,
      delta: { value: '+2', positive: true },
    },
    {
      label: 'Under Review',
      value: '2',
      color: 'blue' as const,
      delta: { value: '2 hrs avg', positive: false },
    },
    {
      label: 'Approved',
      value: '12',
      color: 'amber' as const,
      delta: { value: '+3', positive: true },
    },
    {
      label: 'This Month',
      value: '19',
      color: 'rose' as const,
      delta: { value: 'approvals', positive: true },
    },
  ]

  return (
    <DashboardLayout
      title="Class Dashboard"
      subtitle="BSc CSE · 2nd Semester"
      navItems={navItems}
      role={role as 'staff' | 'admin'}
    >
      {/* Greeting */}
      <Greeting 
        name={name || 'Faculty'} 
        subtitle="You have 5 pending submissions to review" 
      />

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Pending Submissions Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Pending Submissions"
              action={<a href="/staff?tab=submissions" className="text-[#3DF49A]">View all →</a>}
            />
            <div className="space-y-2">
              {[
                { id: 1, name: 'Ananya Sharma', submitted: '2 hours ago', status: 'pending' },
                { id: 2, name: 'Raj Patel', submitted: '5 hours ago', status: 'pending' },
                { id: 3, name: 'Priya Kapoor', submitted: '1 day ago', status: 'pending' },
                { id: 4, name: 'Arjun Singh', submitted: '1 day ago', status: 'under_review' },
                { id: 5, name: 'Zainab Khan', submitted: '2 days ago', status: 'under_review' },
              ].map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between px-3 py-2.25 border-b border-[#1F2421] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold">{sub.name}</div>
                    <div className="text-[11px] text-[#8A938E]">Submitted {sub.submitted}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        sub.status === 'pending'
                          ? 'bg-[rgba(245,168,92,0.1)] text-[#F5A85C]'
                          : 'bg-[rgba(96,168,250,0.1)] text-[#60A8FA]'
                      }`}
                    >
                      {sub.status === 'pending' ? '⏳ Pending' : '🔍 Reviewing'}
                    </span>
                    <button className="text-[#3DF49A] opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-semibold">
                      Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Class Stats */}
        <div className="space-y-3.5">
          <Card>
            <CardHeader title="Class Statistics" />
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-[#8A938E]">Completion Rate</span>
                  <span className="text-[11px] font-semibold text-[#3DF49A]">67%</span>
                </div>
                <div className="h-2 bg-[#1F2421] rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-[#3DF49A] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-[#8A938E]">Avg Quiz Score</span>
                  <span className="text-[11px] font-semibold text-[#60A8FA]">82%</span>
                </div>
                <div className="h-2 bg-[#1F2421] rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-[#60A8FA] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-[#8A938E]">Student Engagement</span>
                  <span className="text-[11px] font-semibold text-[#F5A85C]">71%</span>
                </div>
                <div className="h-2 bg-[#1F2421] rounded-full overflow-hidden">
                  <div className="h-full w-[71%] bg-[#F5A85C] rounded-full" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Announcements" />
            <button className="w-full py-2 text-[12px] font-semibold text-[#3DF49A] hover:text-[#5BFBA8] transition-colors rounded-lg hover:bg-[rgba(61,244,154,0.08)]">
              + Create Announcement
            </button>
          </Card>
        </div>
      </div>

      {/* Chapter Performance */}
      <Card className="mt-3.5">
        <CardHeader title="Chapter Difficulty Ranking" />
        <div className="space-y-2">
          {[
            { ch: 'Chapter 3: 2nd Order ODEs', difficulty: 'Hard', students: 12 },
            { ch: 'Chapter 6: Laplace Transforms', difficulty: 'Hard', students: 8 },
            { ch: 'Chapter 2: 1st Order ODEs', difficulty: 'Medium', students: 4 },
            { ch: 'Chapter 1: Introduction', difficulty: 'Easy', students: 2 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-3 py-2.25 border-b border-[#1F2421] last:border-0">
              <div className="flex-1">
                <div className="text-[12.5px] font-semibold">{item.ch}</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.difficulty === 'Hard'
                      ? 'bg-[rgba(242,107,107,0.1)] text-[#F26B6B]'
                      : item.difficulty === 'Medium'
                        ? 'bg-[rgba(245,168,92,0.1)] text-[#F5A85C]'
                        : 'bg-[rgba(61,244,154,0.1)] text-[#3DF49A]'
                  }`}
                >
                  {item.difficulty}
                </span>
                <span className="text-[11px] text-[#8A938E] w-12 text-right">{item.students} students</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
