import { useEffect } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { useShellStore } from '@/stores/shell-store'
import { LayoutProvider } from '@/context/layout-provider'
import { SkipToMain } from '@/components/skip-to-main'
import FluentMenu from '@/features/mes-agent/components/FluentMenu'
import { CANVAS } from '@/features/mes-agent/constants'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: CANVAS,
  },
  page: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    // Same geometry as the MES page: no top padding (the screen's
    // own HeaderBlock touches the top edge), 8px on the other sides.
    padding: '0px 8px 8px 8px',
    backgroundColor: CANVAS,
    overflow: 'hidden',
  },
})

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

// Unified shell (Phase 1): the MES-standard FluentMenu + canvas page
// column, directly — no AppSidebar, no layout/header, no SearchProvider
// (now at the root). HeaderBlock is NOT rendered here: each screen
// renders its own HeaderBlock at the top of its content, exactly like
// the MES page does, so the tab strip sits above that screen's
// object tabs / ribbon / title strip. LayoutProvider is kept because
// screens (e.g. settings via config-drawer) still read it; SkipToMain
// is kept, pointing at the page column below.
// Direct URL navigation registers the route as a document tab, so
// opening /tasks by URL also shows a Tasks tab.
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const styles = useStyles()
  const { pathname } = useLocation()
  const menuExpanded = useShellStore((state) => state.menuExpanded)
  const toggleMenu = useShellStore((state) => state.toggleMenu)
  const registerRoute = useShellStore((state) => state.registerRoute)

  useEffect(() => {
    registerRoute(pathname)
  }, [pathname, registerRoute])

  return (
    <LayoutProvider>
      <div className={styles.root}>
        <SkipToMain />
        <FluentMenu expanded={menuExpanded} onToggle={toggleMenu} />
        <div id='content' className={styles.page}>
          {children ?? <Outlet />}
        </div>
      </div>
    </LayoutProvider>
  )
}
