'use client'

import { DashboardLayout, type NavItem } from '@/app/components/dashboard/DashboardLayout'
import { Greeting } from '@/app/components/dashboard/Greeting'
import { StatsRow } from '@/app/components/dashboard/StatsRow'
import { Card, CardHeader, ContinueCard } from '@/app/components/dashboard/Cards'
import {
  IconHome,
  IconBook,
  IconQuiz,
  IconProgress,
  IconCertificate,
} from '@/app/components/dashboard/Icons'
import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function StudentDashboard() {
  const { role, name, isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && (!isSignedIn || role !== 'student')) {
      router.push('/auth/sign-in')
    }
  }, [isLoaded, isSignedIn, role, router])

  if (!isLoaded || role !== 'student') {
    return null
  }

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <IconHome />,
      active: true,
    },
    {
      label: 'Chapters',
      href: '/learn',
      icon: <IconBook />,
    },
    {
      label: 'Quizzes',
      href: '/quiz',
      icon: <IconQuiz />,
      badge: '2',
    },
    {
      label: 'Progress',
      href: '/dashboard?tab=progress',
      icon: <IconProgress />,
    },
    {
      label: 'Certificate',
      href: '/certificate',
      icon: <IconCertificate />,
    },
  ]

  const stats = [
    {
      label: 'Chapters Read',
      value: '4',
      unit: '/ 8',
      color: 'mint' as const,
      delta: { value: '+1', positive: true },
    },
    {
      label: 'Quizzes Passed',
      value: '3',
      unit: '/ 8',
      color: 'blue' as const,
      delta: { value: '+1', positive: true },
    },
    {
      label: 'Overall Progress',
      value: '53',
      unit: '%',
      color: 'amber' as const,
      delta: { value: '+5%', positive: true },
    },
    {
      label: 'Streak',
      value: '5',
      unit: 'days',
      color: 'rose' as const,
      delta: { value: 'Active', positive: true },
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
        subtitle="You're 50% through the course" 
      />

      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Continue Learning Card */}
      <ContinueCard
        title="Chapter 4: Partial Differential Equations"
        subtitle="Continue where you left off. You were on page 12 of 28."
        progress={43}
        progressColor="mint"
        button={
          <a
            href="/learn/chapter-4"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3DF49A] text-[#06160E] rounded-lg font-semibold text-[12.5px] hover:bg-[#5BFBA8] transition-colors"
          >
            Continue
          </a>
        }
      />

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
              {[
                { num: 1, title: 'Introduction to ODEs', status: 'completed', quiz: 'passed' },
                { num: 2, title: 'First Order ODEs', status: 'completed', quiz: 'passed' },
                { num: 3, title: 'Second Order ODEs', status: 'completed', quiz: 'passed' },
                { num: 4, title: 'Partial Differential Equations', status: 'reading', quiz: 'pending' },
                { num: 5, title: 'Boundary Value Problems', status: 'unread', quiz: 'untaken' },
              ].map((ch) => (
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
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        ch.status === 'completed'
                          ? 'bg-[rgba(61,244,154,0.1)] text-[#3DF49A]'
                          : ch.status === 'reading'
                            ? 'bg-[rgba(96,168,250,0.1)] text-[#60A8FA]'
                            : 'bg-[rgba(74,84,80,0.4)] text-[#8A938E]'
                      }`}
                    >
                      {ch.status === 'completed' ? '✓ Read' : ch.status === 'reading' ? '◐ Reading' : '○ Unread'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        ch.quiz === 'passed'
                          ? 'bg-[rgba(61,244,154,0.1)] text-[#3DF49A]'
                          : ch.quiz === 'pending'
                            ? 'bg-[rgba(245,168,92,0.1)] text-[#F5A85C]'
                            : 'bg-[rgba(74,84,80,0.4)] text-[#8A938E]'
                      }`}
                    >
                      {ch.quiz === 'passed' ? '✓ Passed' : ch.quiz === 'pending' ? '○ Pending' : '○ Untaken'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Attempts */}
        <div>
          <Card>
            <CardHeader title="Recent Quiz Attempts" />
            <div className="space-y-2">
              {[
                { ch: 3, score: 85, status: 'passed', date: '2 days ago' },
                { ch: 2, score: 92, status: 'passed', date: '5 days ago' },
                { ch: 1, score: 78, status: 'passed', date: '1 week ago' },
              ].map((attempt, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2.25 border-b border-[#1F2421] last:border-0 text-[11px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">Chapter {attempt.ch}</span>
                    <span
                      className={`font-bold ${
                        attempt.status === 'passed' ? 'text-[#3DF49A]' : 'text-[#F26B6B]'
                      }`}
                    >
                      {attempt.score}%
                    </span>
                  </div>
                  <div className="text-[#8A938E]">{attempt.date}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Certificate Status */}
      <Card className="mt-3.5">
        <CardHeader title="Certificate Status" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[#8A938E] mb-1">
              Complete all chapters & quizzes to apply for your certificate
            </p>
            <div className="text-[13px] font-semibold">
              Progress: <span className="text-[#3DF49A]">4/8</span> chapters, <span className="text-[#60A8FA]">3/8</span> quizzes
            </div>
          </div>
          <button
            disabled
            className="px-4 py-2 bg-[#2A312D] text-[#8A938E] rounded-lg font-semibold text-[12.5px] cursor-not-allowed"
          >
            Apply Certificate
          </button>
        </div>
      </Card>
    </DashboardLayout>
  )
}
