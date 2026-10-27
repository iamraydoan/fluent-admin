import {
  Alert24Filled,
  Alert24Regular,
  Apps24Filled,
  Apps24Regular,
  Bug24Filled,
  Bug24Regular,
  bundleIcon,
  Chat24Filled,
  Chat24Regular,
  ClipboardTask24Filled,
  ClipboardTask24Regular,
  Desktop24Filled,
  Desktop24Regular,
  DocumentDismiss24Filled,
  DocumentDismiss24Regular,
  Home24Filled,
  Home24Regular,
  Image24Regular,
  LockClosed24Filled,
  LockClosed24Regular,
  MusicNote124Regular,
  Navigation24Regular,
  PaintBrush24Filled,
  PaintBrush24Regular,
  People24Filled,
  People24Regular,
  PersonEdit24Filled,
  PersonEdit24Regular,
  PersonProhibited24Filled,
  PersonProhibited24Regular,
  QuestionCircle24Filled,
  QuestionCircle24Regular,
  Server24Filled,
  Server24Regular,
  Settings24Filled,
  Settings24Regular,
  Shield24Filled,
  Shield24Regular,
  Wrench24Filled,
  Wrench24Regular,
} from '@fluentui/react-icons'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

// Group 1 icons: sidebar icons are Fluent bundles — Regular at rest,
// Filled when the item is the current route (app-sidebar passes
// filled={pathname === item.url} for leaves). Same 24px size and
// position; only the glyph weight changes on selection. ClerkLogo
// is a brand mark, not a UI icon, so it stays unbundled.
const HomeIcon = bundleIcon(Home24Filled, Home24Regular)
const ClipboardTaskIcon = bundleIcon(
  ClipboardTask24Filled,
  ClipboardTask24Regular
)
const AppsIcon = bundleIcon(Apps24Filled, Apps24Regular)
const ChatIcon = bundleIcon(Chat24Filled, Chat24Regular)
const PeopleIcon = bundleIcon(People24Filled, People24Regular)
const ShieldIcon = bundleIcon(Shield24Filled, Shield24Regular)
const BugIcon = bundleIcon(Bug24Filled, Bug24Regular)
const LockClosedIcon = bundleIcon(LockClosed24Filled, LockClosed24Regular)
const PersonProhibitedIcon = bundleIcon(
  PersonProhibited24Filled,
  PersonProhibited24Regular
)
const DocumentDismissIcon = bundleIcon(
  DocumentDismiss24Filled,
  DocumentDismiss24Regular
)
const ServerIcon = bundleIcon(Server24Filled, Server24Regular)
const WrenchIcon = bundleIcon(Wrench24Filled, Wrench24Regular)
const SettingsIcon = bundleIcon(Settings24Filled, Settings24Regular)
const PersonEditIcon = bundleIcon(PersonEdit24Filled, PersonEdit24Regular)
const PaintBrushIcon = bundleIcon(PaintBrush24Filled, PaintBrush24Regular)
const AlertIcon = bundleIcon(Alert24Filled, Alert24Regular)
const DesktopIcon = bundleIcon(Desktop24Filled, Desktop24Regular)
const QuestionCircleIcon = bundleIcon(
  QuestionCircle24Filled,
  QuestionCircle24Regular
)

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
          icon: HomeIcon,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ClipboardTaskIcon,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: AppsIcon,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: ChatIcon,
        },
        {
          title: 'Users',
          url: '/users',
          icon: PeopleIcon,
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
          icon: ShieldIcon,
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
          icon: BugIcon,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: LockClosedIcon,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: PersonProhibitedIcon,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: DocumentDismissIcon,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerIcon,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: WrenchIcon,
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
          icon: SettingsIcon,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: PersonEditIcon,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: WrenchIcon,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: PaintBrushIcon,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: AlertIcon,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: DesktopIcon,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: QuestionCircleIcon,
        },
      ],
    },
  ],
}
