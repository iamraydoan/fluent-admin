import { Outlet } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import {
  Alert20Regular,
  Desktop20Regular,
  PaintBrush20Regular,
  PersonSettings20Regular,
  Wrench20Regular,
} from '@fluentui/react-icons'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarNav } from './components/sidebar-nav'

const useStyles = makeStyles({
  heading: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  separator: {
    marginTop: '16px',
    marginBottom: '24px',
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    gap: '8px',
    '@media (min-width: 1024px)': {
      flexDirection: 'row',
      gap: '48px',
    },
  },
  aside: {
    flexShrink: 0,
    '@media (min-width: 1024px)': {
      position: 'sticky',
      top: '0px',
      width: '20%',
    },
  },
  outlet: {
    display: 'flex',
    width: '100%',
    overflowY: 'hidden',
    padding: '4px',
    boxSizing: 'border-box',
  },
  search: {
    marginRight: 'auto',
  },
})

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings',
    icon: <PersonSettings20Regular />,
  },
  {
    title: 'Account',
    href: '/settings/account',
    icon: <Wrench20Regular />,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: <PaintBrush20Regular />,
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: <Alert20Regular />,
  },
  {
    title: 'Display',
    href: '/settings/display',
    icon: <Desktop20Regular />,
  },
]

export function Settings() {
  const styles = useStyles()
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className={styles.search}>
          <Search />
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <div className={styles.heading}>
          <Text size={700} weight='bold'>
            Settings
          </Text>
          <Text size={300}>
            Manage your account settings and set e-mail preferences.
          </Text>
        </div>
        <Separator className={styles.separator} />
        <div className={styles.body}>
          <aside className={styles.aside}>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className={styles.outlet}>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
