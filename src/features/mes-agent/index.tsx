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
import { Header } from '@/components/layout/header'
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
// Navigation is deliberately NOT rebuilt here: the page lives inside the
// original authenticated layout, so the original sidebar is the menu.
// Its collapse/expand is the original SidebarTrigger (rendered by the
// layout's Header above), with collapsible='icon' + variant='inset'
// from the layout provider, and SidebarInset automatically widens the
// content when the sidebar collapses. The demo's own Rail was removed
// for this integration, so there is no second menu.

const useStyles = makeStyles({
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
  content: {
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

  return (
    <>
      {/* Original menu toggle: SidebarTrigger lives in this Header. */}
      <Header />
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

          <div className={styles.content}>
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
      </FluentProvider>
    </>
  )
}
