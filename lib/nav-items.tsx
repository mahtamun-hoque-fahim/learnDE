import {
  IconBook,
  IconQuiz,
  IconProgress,
  IconCertificate,
  IconUsers,
  IconStaff,
  IconAnalytics,
  IconSettings,
  IconAnnouncements,
} from '@/app/components/dashboard/Icons'
import { LogoIcon } from '@/app/components/Logo'
import type { NavItem } from '@/app/components/dashboard/DashboardLayout'

/**
 * Centralized nav definitions. Every nav item routes to a real page —
 * no more `?tab=` dead links. Routes that aren't built yet land on a
 * shared "coming soon" stub at the canonical URL.
 *
 * Active state is auto-detected by DashboardLayout from usePathname(),
 * so we don't need to mark `active: true` here.
 */

export function getAdminNavItems(): NavItem[] {
  return [
    { label: 'Overview',  href: '/admin',           icon: <LogoIcon /> },
    { label: 'Users',     href: '/admin/users',     icon: <IconUsers /> },
    { label: 'Staff',     href: '/admin/staff',     icon: <IconStaff /> },
    { label: 'Courses',   href: '/admin/courses',   icon: <IconBook /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <IconAnalytics /> },
    { label: 'Settings',  href: '/admin/settings',  icon: <IconSettings /> },
  ]
}

export function getStaffNavItems(): NavItem[] {
  return [
    { label: 'Overview',      href: '/staff',               icon: <LogoIcon /> },
    { label: 'Students',      href: '/staff/students',      icon: <IconUsers /> },
    { label: 'Chapters',      href: '/staff/chapters',      icon: <IconBook /> },
    { label: 'Quizzes',       href: '/staff/quizzes',       icon: <IconQuiz /> },
    { label: 'Announcements', href: '/staff/announcements', icon: <IconAnnouncements /> },
    { label: 'Reports',       href: '/staff/reports',       icon: <IconAnalytics /> },
  ]
}

export function getStudentNavItems(opts: { pendingQuizzes?: number } = {}): NavItem[] {
  return [
    { label: 'Dashboard',   href: '/dashboard',   icon: <LogoIcon /> },
    { label: 'Chapters',    href: '/learn',       icon: <IconBook /> },
    {
      label: 'Quizzes',
      href: '/quiz',
      icon: <IconQuiz />,
      badge: opts.pendingQuizzes && opts.pendingQuizzes > 0 ? String(opts.pendingQuizzes) : undefined,
    },
    { label: 'Progress',    href: '/dashboard/progress', icon: <IconProgress /> },
    { label: 'Certificate', href: '/certificate',         icon: <IconCertificate /> },
  ]
}
