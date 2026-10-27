import { useState } from 'react'
import {
  Button,
  FluentProvider,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  Text,
  makeStyles,
  tokens,
  webLightTheme,
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { getCookie } from '@/lib/cookies'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import DetailsCard from './components/DetailsCard'
import HeaderBlock from './components/HeaderBlock'
import MainCard from './components/MainCard'
import { CANVAS } from './constants'
import type { SectionId } from './types'

// MesAgentPage is only composition + state. Every visual block lives in
// its own component under ./components/, each owning its own styles:
//   HeaderBlock     — document tab + object tabs + ribbon + title strip
//     DocumentTabBar, Ribbon, TitleStrip (inside HeaderBlock)
//   DetailsCard     — left "Details View" card and its Nav
//   MainCard        — right card: inner toolbar, title, section content
//     ToolTable     — grouped MCP tools table
// Data lives in ./data.ts, shared constants in ./constants.ts.
//
// FULL-PAGE LAYOUT, NOT A CHILD CONTENT BOX: this page deliberately
// does NOT use AuthenticatedLayout / SidebarInset (no inset margins,
// no rounded inset panel, no shadow panel) and does NOT render a
// shadcn Header bar on top of MES content. Instead it reuses the
// original menu system exactly as AuthenticatedLayout does —
// SearchProvider > LayoutProvider > SidebarProvider > AppSidebar —
// with MES content as the flex-1 full-height sibling of AppSidebar,
// so the page fills the viewport next to the sidebar, like the demo.
// The demo's own Rail is NOT rebuilt here, and no new menu is invented.
//
// MENU TOGGLE, WITHOUT A SECOND PAGE HEADER: collapse/expand uses
// the original mechanisms only — SidebarRail, the edge handle already
// rendered inside AppSidebar (data-slot="sidebar-rail", aria-label
// "Toggle Sidebar", onClick = SidebarProvider's toggleSidebar), and
// the Ctrl/Cmd+B keyboard shortcut registered by SidebarProvider.
// That is why there is no SidebarTrigger / Header bar on this page:
// adding one would recreate the rejected header-on-top-of-content
// layout. Sidebar open state persists via the sidebar_state cookie,
// exactly as in AuthenticatedLayout, so collapsing here carries over
// when navigating back to the other screens.

const useStyles = makeStyles({
  content: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  page: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
    backgroundColor: CANVAS,
    color: tokens.colorNeutralForeground1,
  },
  grid: {
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

  const notify = (message: string) =>
    setNotice(`${message} (mock, no API call)`)

  // Same default as AuthenticatedLayout: open unless the cookie says so.
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <div className={styles.content}>
            <FluentProvider theme={webLightTheme}>
              <div className={styles.page}>
                <HeaderBlock
                  objectTab={objectTab}
                  onObjectTabChange={setObjectTab}
                  headerCollapsed={headerCollapsed}
                  onCollapseHeader={() => setHeaderCollapsed(true)}
                  onExpandHeader={() => setHeaderCollapsed(false)}
                  notify={notify}
                />

                <div className={styles.grid}>
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

                  <DetailsCard
                    sectionId={sectionId}
                    onSectionChange={setSectionId}
                  />

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
            </FluentProvider>
          </div>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
