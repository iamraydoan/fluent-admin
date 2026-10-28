import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import PageTop from '@/components/layout/page-top'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
    minHeight: 0,
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  card: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
})

// Object tabs replace the old left SidebarNav: one tab per settings
// sub-route, with the tab value equal to the route so selecting a tab
// navigates to it.
const SETTINGS_TABS = [
  { value: '/settings', label: 'Profile' },
  { value: '/settings/account', label: 'Account' },
  { value: '/settings/appearance', label: 'Appearance' },
  { value: '/settings/notifications', label: 'Notifications' },
  { value: '/settings/display', label: 'Display' },
]

export function Settings() {
  const styles = useStyles()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <PageTop
        title='Settings'
        objectTabs={SETTINGS_TABS}
        objectTab={pathname}
        onObjectTabChange={(value) => navigate({ to: value })}
        // No action bar: the settings screens have no Refresh/Save/Reset
        // action — each form keeps its own Update submit button, so no
        // action bar row is rendered rather than inventing an action.
        actionBar={undefined}
      />
      <Card
        className={styles.card}
        style={{
          padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
          borderRadius: tokens.borderRadiusMedium,
          boxShadow: tokens.shadow2,
        }}
      >
        <Outlet />
      </Card>
    </div>
  )
}
