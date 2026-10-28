import {
  Alert24Filled,
  Alert24Regular,
  Apps24Filled,
  Apps24Regular,
  bundleIcon,
  ClipboardTask24Filled,
  ClipboardTask24Regular,
  Desktop24Filled,
  Desktop24Regular,
  History24Filled,
  History24Regular,
  Home24Filled,
  Home24Regular,
  Image24Regular,
  MusicNote124Regular,
  Navigation24Regular,
  PaintBrush24Filled,
  PaintBrush24Regular,
  People24Filled,
  People24Regular,
  PersonEdit24Filled,
  PersonEdit24Regular,
  QuestionCircle24Filled,
  QuestionCircle24Regular,
  Settings24Filled,
  Settings24Regular,
  Shield24Filled,
  Shield24Regular,
  Wrench24Filled,
  Wrench24Regular,
} from '@fluentui/react-icons'
import { type NavigationData } from '../types'

// Group 1 icons: navigation icons are Fluent bundles — Regular at rest,
// Filled when the item is the current route (navigation-pane passes
// filled={pathname === item.url} for leaves). Same 24px size and
// position; only the glyph weight changes on selection.
const HomeIcon = bundleIcon(Home24Filled, Home24Regular)
const ClipboardTaskIcon = bundleIcon(
  ClipboardTask24Filled,
  ClipboardTask24Regular
)
const AppsIcon = bundleIcon(Apps24Filled, Apps24Regular)
const PeopleIcon = bundleIcon(People24Filled, People24Regular)
const ShieldIcon = bundleIcon(Shield24Filled, Shield24Regular)
const HistoryIcon = bundleIcon(History24Filled, History24Regular)
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
      logo: Navigation24Regular,
      plan: 'Enterprise',
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
