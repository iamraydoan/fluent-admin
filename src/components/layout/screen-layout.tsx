import { useEffect } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useShellStore } from '@/stores/shell-store'
import { LayoutProvider } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { SkipToMain } from '@/components/skip-to-main'
import NavigationPane from './navigation-pane'
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
    gap: tokens.spacingVerticalS,
    // Same geometry as the MES page: no top padding (the screen's
    // own PageTop touches the top edge), 8px on the other sides.
    padding: '0px 8px 8px 8px',
    backgroundColor: CANVAS,
    overflow: 'hidden',
  },
})

type ScreenLayoutProps = {
  children?: React.ReactNode
}

// Unified shell (Phase 1): the MES-standard NavigationPane + canvas page
// column, directly — no NavigationPane, no layout/header, no SearchProvider
// (now at the root). PageTop is NOT rendered here: each screen
// renders its own PageTop at the top of its content, exactly like
// the MES page does, so the tab strip sits above that screen's
// object tabs / action bar / page title. LayoutProvider is kept because
// screens (e.g. settings via config-drawer) still read it; SkipToMain
// is kept, pointing at the page column below.
// Direct URL navigation registers the route as a document tab, so
// opening /tasks by URL also shows a Tasks tab.
export function ScreenLayout({ children }: ScreenLayoutProps) {
  const styles = useStyles()
  const { pathname } = useLocation()
  const menuExpanded = useShellStore((state) => state.menuExpanded)
  const toggleMenu = useShellStore((state) => state.toggleMenu)
  const registerRoute = useShellStore((state) => state.registerRoute)

  useEffect(() => {
    registerRoute(pathname)
  }, [pathname, registerRoute])

  // Canvas: light keeps the exact CANVAS (#e6e8eb, now equal to the
  // tab-strip HEADER_GREY — see shell-constants.ts) from the class;
  // dark swaps it for the dark tab-strip colour
  // (colorNeutralBackground2, the dark strip in Header)
  // instead of the previous Background3, so the dark 8px gap at the
  // header's left edge blends with the dark tab strip exactly as
  // light does, while the dark header surface (Background1) still
  // reads as a card on it. The token var resolves under the root
  // FluentProvider, which follows the same resolved theme.
  const { resolvedTheme } = useTheme()
  const canvasStyle =
    resolvedTheme === 'dark'
      ? { backgroundColor: tokens.colorNeutralBackground2 }
      : undefined

  return (
    <LayoutProvider>
      <div className={styles.root} style={canvasStyle}>
        <SkipToMain />
        <NavigationPane expanded={menuExpanded} onToggle={toggleMenu} />
        <div id='content' className={styles.page} style={canvasStyle}>
          {children ?? <Outlet />}
        </div>
      </div>
    </LayoutProvider>
  )
}
