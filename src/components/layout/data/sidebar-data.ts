import {
  Alert24Regular,
  Apps24Regular,
  Bug24Regular,
  Chat24Regular,
  Desktop24Regular,
  DocumentDismiss24Regular,
  Home24Regular,
  Image24Regular,
  LockClosed24Regular,
  MusicNote124Regular,
  Navigation24Regular,
  PaintBrush24Regular,
  People24Regular,
  PersonEdit24Regular,
  PersonProhibited24Regular,
  QuestionCircle24Regular,
  Server24Regular,
  Settings24Regular,
  Shield24Regular,
  ClipboardTask24Regular,
  Wrench24Regular,
} from '@fluentui/react-icons'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
    // Kept from the retired menu-data ACCOUNT: the avatar image
    // file does not exist in public/, so the header avatar falls
    // back to these initials ('SN', not 'S' from the name alone).
    initials: 'SN',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Navigation24Regular,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: Image24Regular,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: MusicNote124Regular,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: Home24Regular,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ClipboardTask24Regular,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Apps24Regular,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: Chat24Regular,
        },
        {
          title: 'Users',
          url: '/users',
          icon: People24Regular,
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/clerk/sign-up',
            },
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
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
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
              icon: PersonProhibited24Regular,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: DocumentDismiss24Regular,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: Server24Regular,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Wrench24Regular,
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
            {
              title: 'Profile',
              url: '/settings',
              icon: PersonEdit24Regular,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench24Regular,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: PaintBrush24Regular,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Alert24Regular,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Desktop24Regular,
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
  ],
}
