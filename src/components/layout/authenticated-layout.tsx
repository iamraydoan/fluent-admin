import { useEffect } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useShellStore } from '@/stores/shell-store'
import { LayoutProvider } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { SkipToMain } from '@/components/skip-to-main'
import AppSidebar from './app-sidebar'
import { CANVAS } from './shell-constants'

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
    // The 8px side padding applies to the content BELOW the header
    // only: HeaderBlock escapes it with -8px side margins (see
    // header-block.tsx), so the header is flush with the sidebar
    // on the left and the viewport on the right, while the main
    // content card below keeps its normal 8px inset. Do not
    // remove the side padding here — that would flush the content
    // card too — and do not "fix" the header edge by changing the
    // canvas colour, which would still leave a grey bar against
    // the white header below.
    padding: '0px 8px 8px 8px',
    backgroundColor: CANVAS,
    overflow: 'hidden',
  },
})

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

// Unified shell (Phase 1): the MES-standard AppSidebar + canvas page
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

  // Canvas: light keeps the exact CANVAS (#dee1e6) from the class;
  // dark swaps it for the darkest neutral surface via an inline
  // override (no light token equals #dee1e6, so a token class alone
  // would shift light mode). The token var resolves under the root
  // FluentProvider, which follows the same resolved theme.
  const { resolvedTheme } = useTheme()
  const canvasStyle =
    resolvedTheme === 'dark'
      ? { backgroundColor: tokens.colorNeutralBackground3 }
      : undefined

  return (
    <LayoutProvider>
      <div className={styles.root} style={canvasStyle}>
        <SkipToMain />
        <AppSidebar expanded={menuExpanded} onToggle={toggleMenu} />
        <div id='content' className={styles.page} style={canvasStyle}>
          {children ?? <Outlet />}
        </div>
      </div>
    </LayoutProvider>
  )
}
