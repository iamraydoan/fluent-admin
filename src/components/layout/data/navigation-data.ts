import {
  Alert20Regular,
  Apps20Regular,
  ClipboardTask20Regular,
  Desktop20Regular,
  History20Regular,
  Home20Regular,
  Image20Regular,
  MusicNote120Regular,
  Navigation20Regular,
  PaintBrush20Regular,
  People20Regular,
  PersonEdit20Regular,
  QuestionCircle20Regular,
  Settings20Regular,
  Shield20Regular,
  Wrench20Regular,
} from '@fluentui/react-icons'
import { type NavigationData } from '../types'

// Thinning (2026-10-28): navigation icons are 20px Regular only.
// The active item is marked by the 3px brand bar + brand colour in
// navigation-pane, not by a Filled glyph, so no bundleIcon is used
// and the active/inactive glyphs are identical.
const HomeIcon = Home20Regular
const ClipboardTaskIcon = ClipboardTask20Regular
const AppsIcon = Apps20Regular
const PeopleIcon = People20Regular
const ShieldIcon = Shield20Regular
const HistoryIcon = History20Regular
const WrenchIcon = Wrench20Regular
const SettingsIcon = Settings20Regular
const PersonEditIcon = PersonEdit20Regular
const PaintBrushIcon = PaintBrush20Regular
const AlertIcon = Alert20Regular
const DesktopIcon = Desktop20Regular
const QuestionCircleIcon = QuestionCircle20Regular

export const navigationData: NavigationData = {
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    // Neutral placeholder path: no avatar file ships in public/,
    // so the header avatar falls back to these initials ('AU').
    avatar: '/avatars/admin.jpg',
    initials: 'AU',
  },
  teams: [
    {
      name: 'Fluent Admin',
      logo: Navigation20Regular,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Inc',
      logo: Image20Regular,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: MusicNote120Regular,
      plan: 'Startup',
    },
  ],
  // Enterprise grouping. Demo destinations (Chats, Auth pages,
  // Errors pages, and the sign-in/sign-up/user-management group)
  // are intentionally absent here but their route files are kept,
  // so direct links still resolve; they simply do not appear in
  // the main nav. RBAC and Audit Log entries point at the RBAC
  // and Audit Log screens, whose routes now exist.
  navGroups: [
    {
      title: 'Administration',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: HomeIcon,
        },
        {
          title: 'Users',
          url: '/users',
          icon: PeopleIcon,
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
      ],
    },
    {
      title: 'Configuration',
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
      ],
    },
    {
      title: 'System Tools',
      items: [
        {
          title: 'RBAC',
          url: '/rbac',
          icon: ShieldIcon,
        },
        {
          title: 'Audit Log',
          url: '/audit-log',
          icon: HistoryIcon,
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
