import { useState } from 'react'
import {
  FluentProvider,
  makeStyles,
  tokens,
  webLightTheme,
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  MessageBar,
  MessageBarActions,
  MessageBarBody,
} from '@/components/ui/message-bar'
import { Text } from '@/components/ui/text'
import DetailsCard from './components/DetailsCard'
import FluentMenu from './components/FluentMenu'
import HeaderBlock from './components/HeaderBlock'
import MainCard from './components/MainCard'
import { CANVAS } from './constants'
import type { SectionId } from './types'

// MesAgentPage is only composition + state. Every visual block lives in
// its own component under ./components/, each owning its own styles:
//   FluentMenu      — Fluent Nav menu, demo style, with visible toggle
//   HeaderBlock     — document tab + object tabs + ribbon + title strip
//     DocumentTabBar, Ribbon, TitleStrip (inside HeaderBlock)
//   DetailsCard     — left "Details View" card and its Nav
//   MainCard        — right card: inner toolbar, title, section content
//     ToolTable     — grouped MCP tools table
// Data lives in ./data.ts and ./menu-data.ts, shared constants in
// ./constants.ts.
//
// FULL-PAGE LAYOUT, NOT A CHILD CONTENT BOX: the page is a flex row
// filling the whole viewport — FluentMenu on the left, MES content as
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
  const [menuExpanded, setMenuExpanded] = useState(true)

  const notify = (message: string) =>
    setNotice(`${message} (mock, no API call)`)

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.root}>
        <FluentMenu
          expanded={menuExpanded}
          onToggle={() => setMenuExpanded((prev) => !prev)}
        />

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
