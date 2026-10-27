import type { ComponentType } from 'react'
import {
  Apps24Regular,
  Bot24Regular,
  Bug24Regular,
  Chat24Regular,
  ClipboardTask24Regular,
  Document24Regular,
  LockClosed24Regular,
  ErrorCircle24Regular,
  Home24Regular,
  People24Regular,
  Person24Regular,
  QuestionCircle24Regular,
  Settings24Regular,
  Shield24Regular,
  ShieldCheckmark24Regular,
  Wrench24Regular,
} from '@fluentui/react-icons'

// Menu data for the MES page's Fluent Nav menu. Titles, urls, groups
// and badges are copied verbatim from the original sidebar data
// (src/components/layout/data/sidebar-data.ts) so the menu still
// reaches every original destination. Icons are Fluent equivalents,
// NOT lucide: importing the original sidebar-data file would pull
// lucide-react and the Clerk logo into the MES shell, which point 6
// forbids. Teams and user footer are deliberately NOT included here:
// account info lives only in the header avatar (see ACCOUNT below),
// not duplicated in the menu.
//
// This file is intentionally separate from sidebar-data.ts. Unifying
// the two data sources is step 5 work, once the old screens are
// converted and sidebar-data.ts itself can drop lucide.

export const ACCOUNT = {
  name: 'satnaing',
  email: 'satnaingdev@gmail.com',
  // Original sidebar user avatar path. The file does not exist in
  // this repo's public/ folder (public/ contains only images/), so
  // the Fluent Avatar falls back to the initials below. Keeping the
  // original path here means the photo appears automatically if the
  // asset is added later, without a code change.
  avatar: '/avatars/shadcn.jpg',
  initials: 'SN',
}

export type FluentMenuItem = {
  title: string
  url?: string
  badge?: string
  // Optional: original sub-items for Auth and Secured by Clerk had no
  // icon, so those entries leave icon unset instead of inventing one.
  icon?: ComponentType
  items?: FluentMenuItem[]
}

export type FluentMenuGroup = {
  title: string
  items: FluentMenuItem[]
}

export const MENU_GROUPS: FluentMenuGroup[] = [
  {
    title: 'General',
    items: [
      { title: 'Dashboard', url: '/', icon: Home24Regular },
      { title: 'Tasks', url: '/tasks', icon: ClipboardTask24Regular },
      { title: 'Apps', url: '/apps', icon: Apps24Regular },
      {
        title: 'Chats',
        url: '/chats',
        badge: '3',
        icon: Chat24Regular,
      },
      { title: 'Users', url: '/users', icon: People24Regular },
      { title: 'CM MES Agent', url: '/mes-agent', icon: Bot24Regular },
      {
        title: 'Secured by Clerk',
        icon: ShieldCheckmark24Regular,
        items: [
          { title: 'Sign In', url: '/clerk/sign-in' },
          { title: 'Sign Up', url: '/clerk/sign-up' },
          {
            title: 'User Management',
            url: '/clerk/user-management',
          },
        ],
      },
    ],
  },
  {
    title: 'Pages',
    items: [
      {
        title: 'Auth',
        icon: Shield24Regular,
        items: [
          { title: 'Sign In', url: '/sign-in' },
          { title: 'Sign In (2 Col)', url: '/sign-in-2' },
          { title: 'Sign Up', url: '/sign-up' },
          { title: 'Forgot Password', url: '/forgot-password' },
          { title: 'OTP', url: '/otp' },
        ],
      },
      {
        title: 'Errors',
        icon: Bug24Regular,
        items: [
          {
            title: 'Unauthorized',
            url: '/errors/unauthorized',
            icon: LockClosed24Regular,
          },
          {
            title: 'Forbidden',
            url: '/errors/forbidden',
            icon: Person24Regular,
          },
          {
            title: 'Not Found',
            url: '/errors/not-found',
            icon: Document24Regular,
          },
          {
            title: 'Internal Server Error',
            url: '/errors/internal-server-error',
            icon: ErrorCircle24Regular,
          },
          {
            title: 'Maintenance Error',
            url: '/errors/maintenance-error',
            icon: ErrorCircle24Regular,
          },
        ],
      },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        title: 'Settings',
        icon: Settings24Regular,
        items: [
          { title: 'Profile', url: '/settings', icon: Person24Regular },
          {
            title: 'Account',
            url: '/settings/account',
            icon: Wrench24Regular,
          },
          {
            title: 'Appearance',
            url: '/settings/appearance',
            icon: Settings24Regular,
          },
          {
            title: 'Notifications',
            url: '/settings/notifications',
            icon: Settings24Regular,
          },
          {
            title: 'Display',
            url: '/settings/display',
            icon: Settings24Regular,
          },
        ],
      },
      {
        title: 'Help Center',
        url: '/help-center',
        icon: QuestionCircle24Regular,
      },
    ],
  },
]
