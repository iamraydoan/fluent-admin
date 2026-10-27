import { useState } from 'react'
import { makeStyles } from '@fluentui/react-components'
import { Navigation24Regular } from '@fluentui/react-icons'
import { getCookie, setCookie } from '@/lib/cookies'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Text } from '@/components/ui/text'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

const MENU_WIDTH_EXPANDED = '232px'
const MENU_WIDTH_COLLAPSED = '64px'
const SIDEBAR_COOKIE = 'sidebar_state'

const useStyles = makeStyles({
  sidebar: {
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: '0px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #edebe9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    paddingLeft: '8px',
    // Single selected-item bar: 3px x 20px brand blue, centred, no
    // fill. Fluent Nav marks the selected item aria-current="page".
    '& [aria-current="page"]': {
      backgroundImage: 'linear-gradient(#0f6cbd, #0f6cbd)',
      backgroundSize: '3px 20px',
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'transparent',
    },
    '& [aria-current="page"]::after': {
      display: 'none',
    },
    // NavItems transparent at rest (white menu), pale-grey hover.
    // The base rule is a class rule on purpose, not an inline style:
    // an inline transparent would also beat the hover rule.
    '& button, & a': {
      backgroundColor: 'transparent',
    },
    '& button:not([aria-current="page"]):hover, & a:not([aria-current="page"]):hover':
      {
        backgroundColor: '#f3f2f1',
      },
    '& svg': {
      color: '#424242',
    },
  },
  toggleRow: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    paddingRight: '8px',
  },
  toggleButton: {
    minWidth: '40px',
    width: '40px',
    height: '40px',
    padding: '0px',
    color: '#424242',
  },
  titleRow: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 16px 12px 12px',
    minHeight: '40px',
    boxSizing: 'border-box',
  },
  navScroll: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    flexShrink: 0,
    padding: '8px 8px 8px 0px',
  },
})

export function AppSidebar() {
  const styles = useStyles()
  const [collapsed, setCollapsed] = useState(
    () => getCookie(SIDEBAR_COOKIE) === 'false'
  )

  const toggle = () => {
    setCollapsed((prev) => {
      setCookie(SIDEBAR_COOKIE, prev ? 'true' : 'false')
      return !prev
    })
  }

  const handleRequestExpand = () => {
    setCollapsed(false)
    setCookie(SIDEBAR_COOKIE, 'true')
  }

  const activeTeam = sidebarData.teams[0]
  const TeamLogo = activeTeam.logo

  return (
    <div
      className={styles.sidebar}
      style={{
        width: collapsed ? MENU_WIDTH_COLLAPSED : MENU_WIDTH_EXPANDED,
      }}
    >
      <div
        className={styles.toggleRow}
        style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
      >
        <Button
          appearance='transparent'
          className={styles.toggleButton}
          icon={<Navigation24Regular />}
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          title={collapsed ? 'Expand menu' : 'Collapse menu'}
          onClick={toggle}
        />
      </div>
      <div className={styles.titleRow}>
        <TeamLogo />
        {!collapsed && (
          <Text weight='semibold' size={400}>
            {activeTeam.name}
          </Text>
        )}
      </div>
      <div className={styles.navScroll}>
        {sidebarData.navGroups.map((group) => (
          <NavGroup
            key={group.title}
            {...group}
            collapsed={collapsed}
            onRequestExpand={handleRequestExpand}
          />
        ))}
      </div>
      <Divider />
      <div className={styles.footer}>
        <NavUser user={sidebarData.user} collapsed={collapsed} />
      </div>
    </div>
  )
}
