import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import {
  FluentProvider,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useShellStore } from '@/stores/shell-store'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  MessageBar,
  MessageBarActions,
  MessageBarBody,
} from '@/components/ui/message-bar'
import { Text } from '@/components/ui/text'
import AppSidebar from '@/components/layout/app-sidebar'
import HeaderBlock from '@/components/layout/header-block'
import Ribbon from '@/components/layout/ribbon'
import { CANVAS } from '@/components/layout/shell-constants'
import DetailsCard from './components/DetailsCard'
import MainCard from './components/MainCard'
import { AGENT_NAME, AGENT_STATE } from './data'
import type { SectionId } from './types'

// MesAgentPage is only composition + state. Every visual block lives in
// its own component under ./components/, each owning its own styles:
//   AppSidebar      — Fluent Nav menu, demo style, with visible toggle
//   HeaderBlock     — document tab + object tabs + ribbon + title strip
//     DocumentTabBar, Ribbon, TitleStrip (inside HeaderBlock)
//   DetailsCard     — left "Details View" card and its Nav
//   MainCard        — right card: inner toolbar, title, section content
//     ToolTable     — grouped MCP tools table
// Data lives in ./data.ts; menu/account data is the standard
// sidebar-data (src/components/layout/data/sidebar-data.ts, single
// source shared with AppSidebar, shell-store and command-menu),
// shared constants in @/components/layout/shell-constants.ts.
//
// FULL-PAGE LAYOUT, NOT A CHILD CONTENT BOX: the page is a flex row
// filling the whole viewport — AppSidebar on the left, MES content as
// the flex-1 sibling on the right. There is no shadcn shell here at
// all: no SearchProvider / LayoutProvider / SidebarProvider /
// AppSidebar / SidebarInset / Header, and no team/user footer in the
// menu (account lives only in the header avatar). The root background
// is canvas and the root height is 100vh, so there is no white body
// strip below the content at the footer — the previous white footer
// strip came from the SidebarProvider wrapper's white background
// showing below a MES page that did not stretch (FluentProvider broke
// the flex:1 chain), plus the AppSidebar user footer pinned to the
// bottom of the sidebar column. Both are gone with this layout.
//
// MENU WIDTH, documented: expanded 232px (the same width as the
// Details card, and the demo's left-panel width), collapsed 64px
// (the demo rail width). The original shadcn sidebar was 256px when
// expanded; 232px was chosen because this menu is now demo-styled,
// not the shadcn sidebar, and it keeps MES content wider and closer
// to the demo.

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: CANVAS,
    color: tokens.colorNeutralForeground1,
  },
  page: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    // NO top padding, as in the demo: the header block touches the
    // top edge of the viewport. Left, right and bottom keep 8px, so
    // the canvas shows as an 8px strip on those three sides only.
    padding: '0px 8px 8px 8px',
    backgroundColor: CANVAS,
    overflow: 'hidden',
  },
  grid: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: '232px minmax(0, 1fr)',
    gap: '8px',
    alignItems: 'stretch',
    backgroundColor: CANVAS,
  },
})

export function MesAgentPage() {
  const styles = useStyles()
  const [objectTab, setObjectTab] = useState('Details')
  const [sectionId, setSectionId] = useState<SectionId>('mcp-servers')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'CM MES': true,
  })
  const [headerCollapsed, setHeaderCollapsed] = useState(false)
  const [notice, setNotice] = useState('')
  // Menu state is shared with the _authenticated shell via the shell
  // store, so it survives MES <-> screen navigation.
  const menuExpanded = useShellStore((state) => state.menuExpanded)
  const toggleMenu = useShellStore((state) => state.toggleMenu)
  const registerRoute = useShellStore((state) => state.registerRoute)
  const { pathname } = useLocation()

  useEffect(() => {
    registerRoute(pathname)
  }, [pathname, registerRoute])

  const notify = (message: string) =>
    setNotice(`${message} (mock, no API call)`)

  // MES no longer pins webLightTheme: its nested provider follows the
  // same resolved theme as the root provider, so MES goes dark with
  // the app instead of staying stuck on light. Same-theme nesting
  // does not change MES visuals in light mode.
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  // Canvas: same rule as the authenticated layout — light keeps the
  // exact CANVAS (#dee1e6) from the classes, dark swaps it for the
  // darkest neutral surface. The token var resolves under this
  // page's own (now theme-following) provider.
  const canvasStyle = isDark
    ? { backgroundColor: tokens.colorNeutralBackground3 }
    : undefined

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <div className={styles.root} style={canvasStyle}>
        <AppSidebar expanded={menuExpanded} onToggle={toggleMenu} />

        <div className={styles.page} style={canvasStyle}>
          <HeaderBlock
            title={AGENT_NAME}
            titleState={AGENT_STATE}
            objectTabs={[
              { value: 'Details', label: 'Details' },
              { value: 'References', label: 'References' },
              { value: 'History', label: 'History' },
            ]}
            objectTab={objectTab}
            onObjectTabChange={setObjectTab}
            ribbon={<Ribbon notify={notify} />}
            headerCollapsed={headerCollapsed}
            onCollapseHeader={() => setHeaderCollapsed(true)}
            onExpandHeader={() => setHeaderCollapsed(false)}
          />

          <div className={styles.grid} style={canvasStyle}>
            {notice && (
              <MessageBar intent='info' style={{ gridColumn: '1 / -1' }}>
                <MessageBarBody>
                  <Text size={300}>{notice}</Text>
                </MessageBarBody>
                <MessageBarActions>
                  <Button
                    appearance='transparent'
                    size='small'
                    icon={<Dismiss24Regular />}
                    onClick={() => setNotice('')}
                    aria-label='Dismiss'
                  />
                </MessageBarActions>
              </MessageBar>
            )}

            <DetailsCard sectionId={sectionId} onSectionChange={setSectionId} />

            <MainCard
              objectTab={objectTab}
              sectionId={sectionId}
              expanded={expanded}
              onToggleGroup={(name) =>
                setExpanded((prev) => ({
                  ...prev,
                  [name]: !(prev[name] ?? false),
                }))
              }
              notify={notify}
            />
          </div>
        </div>
      </div>
    </FluentProvider>
  )
}
