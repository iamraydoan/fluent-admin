import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useShellStore } from '@/stores/shell-store'
import { Divider } from '@/components/ui/divider'
import { Tab, TabList } from '@/components/ui/tabs'
import DocumentTabBar from './document-tab-bar'
import TitleStrip from './title-strip'

const useStyles = makeStyles({
  // One DOM block for the whole header. Its top row is the grey
  // document-tab strip (as in the reference); every row below it is white
  // and touches the next row, separated only by a 1px divider.
  headerBlock: {
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    // Header reads as a top bar, not a floating card: with the page
    // top padding removed (see index.tsx), the top corners are
    // square (radius 0) so the header touches the viewport top edge
    // with no canvas strip and no rounded corner showing above it.
    // Bottom corners keep the cards' 8px radius, so the header still
    // curves against the grey content gap below it, as in the demo.
    // overflow hidden is required, otherwise the square white/grey
    // rows inside would paint over the rounded bottom corners.
    borderRadius: '0px 0px 8px 8px',
    overflow: 'hidden',
  },
  objectTabs: {
    backgroundColor: tokens.colorNeutralBackground1,
    paddingLeft: '16px',
    // Reference selected tab text is brand blue, not black bold.
    '& [aria-selected="true"]': {
      color: tokens.colorBrandForeground1,
    },
  },
})

export type ObjectTab = {
  value: string
  label: string
}

export type HeaderBlockProps = {
  title: string
  // Optional state, rendered as "title (state)" in the title strip.
  titleState?: string
  // Ribbon row, passed as a node by the caller (e.g.
  // <Ribbon notify={notify} /> for the MES default groups, or
  // <Ribbon groups={...} /> for a screen's own groups). When
  // undefined, the ribbon row AND its trailing divider are omitted.
  ribbon?: ReactNode
  // Object-tab row. When undefined or empty, the object-tab row AND
  // its trailing divider are omitted — no empty row is left behind.
  objectTabs?: ObjectTab[]
  objectTab?: string
  onObjectTabChange?: (value: string) => void
  headerCollapsed?: boolean
  onCollapseHeader?: () => void
  onExpandHeader?: () => void
  // Optional account slot, passed straight through to DocumentTabBar
  // (Phase 2F): e.g. the Clerk user-management page passes its
  // Clerk UserButton here so it sits in the tab strip instead of the
  // unified avatar. Absent everywhere else, so other screens are
  // untouched. HeaderBlock itself never imports Clerk.
  accountAction?: ReactNode
  // NOTE (Phase 1 deviation from the brief's prop list): the brief
  // listed notify? here, but the ribbon is now a ReactNode owned by
  // the caller, so notify lives on Ribbon, not on HeaderBlock. MES
  // passes ribbon={<Ribbon notify={notify} />}.
}

// Generalised MES header block. The document-tab strip is NOT a prop:
// it always reads tabs/activeUrl from the shell store, so every
// screen that renders HeaderBlock gets the same multi-tab strip for
// free, and tab select/close/back navigate through the router.
export default function HeaderBlock({
  title,
  titleState,
  ribbon,
  objectTabs,
  objectTab,
  onObjectTabChange,
  headerCollapsed = false,
  onCollapseHeader,
  onExpandHeader,
  accountAction,
}: HeaderBlockProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const tabs = useShellStore((state) => state.tabs)
  const activeUrl = useShellStore((state) => state.activeUrl)
  const closeTab = useShellStore((state) => state.closeTab)

  const handleSelectTab = (url: string) => {
    navigate({ to: url })
  }

  const handleCloseTab = (url: string) => {
    const wasActive = url === activeUrl
    const next = closeTab(url)
    if (wasActive) navigate({ to: next })
  }

  const handleBack = () => {
    const index = tabs.findIndex((tab) => tab.url === activeUrl)
    if (index > 0) {
      navigate({ to: tabs[index - 1].url })
    } else {
      // Only one tab (or none): back goes to the dashboard root,
      // which registerRoute re-titles Dashboard.
      navigate({ to: '/' })
    }
  }

  const showObjectTabs = !!objectTabs && objectTabs.length > 0

  return (
    <div className={styles.headerBlock}>
      <DocumentTabBar
        tabs={tabs}
        activeUrl={activeUrl}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onBack={handleBack}
        headerCollapsed={headerCollapsed}
        onExpandHeader={onExpandHeader ?? (() => {})}
        accountSlot={accountAction}
      />
      {!headerCollapsed && (
        <>
          {showObjectTabs && (
            <>
              <div className={styles.objectTabs}>
                <TabList
                  size='small'
                  selectedValue={objectTab}
                  onTabSelect={(_, data) =>
                    onObjectTabChange?.(String(data.value))
                  }
                >
                  {objectTabs.map((tab) => (
                    <Tab key={tab.value} value={tab.value}>
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <Divider />
            </>
          )}
          {ribbon !== undefined && (
            <>
              {ribbon}
              <Divider />
            </>
          )}
          <TitleStrip
            title={title}
            state={titleState}
            onCollapse={onCollapseHeader}
          />
        </>
      )}
    </div>
  )
}
