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
    // HEADER LEFT-EDGE CONTINUITY (2026-10-27): the page column
    // (authenticated-layout.tsx) has 8px side padding, so a plain
    // HeaderBlock sat 8px in from the sidebar, leaving a vertical
    // canvas-colour bar (light #dee1e6, dark Background3) between
    // the sidebar and the header for the header's full height —
    // grey against the tab strip above AND against the header
    // white below, so the header never read as continuous with
    // the sidebar. The fix is these -8px side margins: the header
    // escapes the page column's side padding and touches the
    // sidebar's 1px border on the left and the viewport edge on
    // the right, so the tab strip grey runs continuously from the
    // sidebar edge and the header white runs continuously with
    // the sidebar white below it (apart from that 1px border,
    // which is a proper thin divider, not an 8px bar). The
    // margins are relative to the page column, NOT a fixed
    // sidebar width, so the header stays flush when the sidebar
    // collapses from 232px to 64px. The page column's
    // overflow hidden clips the widened block, so there is no
    // horizontal overflow, and the side padding still applies
    // to everything below the header — the main content card
    // keeps its normal 8px inset, untouched.
    // RIGHT-EDGE DECISION: the header spans the FULL page-column
    // width (both sides flush), not left-flush-only. A left-only
    // flush would leave an asymmetric bar — square on the
    // sidebar side, rounded over a canvas gap on the viewport
    // side — and the right gap would be the same defect mirrored.
    // A top bar spanning edge to edge is not a floating card, so
    // ALL corners are square (radius 0): the top corners were
    // already square (the header touches the viewport top), and
    // the bottom corners are now square too, so no rounded
    // corner floats over a canvas gap on either side and no
    // canvas notch shows at the header's bottom corners. The
    // content card below keeps its own 8px radius, so the
    // rounded-card look survives where it belongs. overflow
    // hidden is still required, otherwise the square white/grey
    // rows inside would paint over the (now square) corners —
    // kept for the row clipping, not for corner rounding.
    marginLeft: '-8px',
    marginRight: '-8px',
    borderRadius: '0px',
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
