// PageTop is generic glue, NOT a vendor area: it renders Header +
// PageTabs + ActionBar + PageTitle, in that screen-layout order.
import { useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useShellStore } from '@/stores/shell-store'
import { Divider } from '@/components/ui/divider'
import Header from './header'
import PageTabs, { type PageTab } from './page-tabs'
import PageTitle from './page-title'

const useStyles = makeStyles({
  // Page-top-border refactor (2026-10-27, user suggestion: "remove
  // the border of the page top and only border the white
  // inside"): the outer block is NO LONGER a card at all — no
  // background, no boxShadow, no border, no radius. The grey
  // tab strip therefore sits free on the page background
  // (page CANVAS equals the strip colour since 564a74b, light and
  // dark), blending seamlessly left/right like Chrome tabs on a
  // grey strip, not inside a bordered card. Only the white rows
  // below the strip are grouped into their own bordered card
  // (whiteCard below). Page padding in screen-layout.tsx
  // is unchanged ('0px 8px 8px 8px'), so the header still sits
  // 8px inset from the sidebar — separate from the sidebar, just
  // not one outer bordered card.
  pageTop: {
    flexShrink: 0,
  },
  // The white inside card: object tabs (if present), action bar (if
  // present) and page title, touching the tab strip with 0 gap.
  // Border is left/right/bottom ONLY, no top border, top corners
  // square: this is merge solution (a). The active document tab
  // is a white Chrome shape whose bottom edge merges into the
  // white below; a top border would cut straight across it with
  // a visible line, and covering that segment (solution (b))
  // would need the tab shape to overlap the card by a negative
  // margin, risking a subpixel seam at 1x. With (a) there is
  // simply no line to cross: under inactive tabs the grey-strip
  // to white colour change itself is the Chrome boundary, and
  // under the active tab white meets white uninterrupted.
  // Stroke token, not a hardcoded colour, so dark mode gets a
  // dark-appropriate stroke automatically. Bottom corners keep
  // the cards' Medium (4px) radius (ws6); overflow hidden clips the inner
  // white rows to those corners. Block width:auto means the
  // 1px side borders are absorbed inside the page-column width,
  // so the white card's outer edges align exactly with the tab
  // strip's edges above it.
  whiteCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: `0px 0px ${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium}`,
    overflow: 'hidden',
  },
})

export type PageTopProps = {
  title: string
  // Optional state, rendered as "title (state)" in the page title.
  titleState?: string
  // ActionBar row, passed as a node by the caller (e.g.
  // <ActionBar notify={notify} /> for the MES default groups, or
  // <ActionBar groups={...} /> for a screen's own groups). When
  // undefined, the action bar row AND its trailing divider are omitted.
  actionBar?: ReactNode
  // Object-tab row. When undefined or empty, the object-tab row AND
  // its trailing divider are omitted — no empty row is left behind.
  objectTabs?: PageTab[]
  objectTab?: string
  onObjectTabChange?: (value: string) => void
  // Collapse: when all three are omitted (the case for every screen
  // today), PageTop keeps the state itself and the Page Title row
  // always shows the ^ collapse button.
  headerCollapsed?: boolean
  onCollapseHeader?: () => void
  onExpandHeader?: () => void
  // Optional account slot, passed straight through to Header
  // (Phase 2F): e.g. the Clerk user-management page passes its
  // Clerk UserButton here so it sits in the tab strip instead of the
  // unified avatar. Absent everywhere else, so other screens are
  // untouched. PageTop itself never imports Clerk.
  accountAction?: ReactNode
  // NOTE (Phase 1 deviation from the brief's prop list): the brief
  // listed notify? here, but the action bar is now a ReactNode owned by
  // the caller, so notify lives on ActionBar, not on PageTop. MES
  // passes actionBar={<ActionBar notify={notify} />}.
}

// Generalised MES page top. The tab strip is NOT a prop:
// it always reads tabs/activeUrl from the shell store, so every
// screen that renders PageTop gets the same multi-tab strip for
// free, and tab select/close/back navigate through the router.
export default function PageTop({
  title,
  titleState,
  actionBar,
  objectTabs,
  objectTab,
  onObjectTabChange,
  headerCollapsed: headerCollapsedProp,
  onCollapseHeader,
  onExpandHeader,
  accountAction,
}: PageTopProps) {
  const styles = useStyles()
  // Collapse is wired by default: every screen gets the ^ button in
  // the Page Title row (as in the reference bar), even though no
  // caller passes collapse props today. Callers that pass both
  // headerCollapsed and the handlers keep full control; callers
  // that pass only one handler should pass both, or the internal
  // state below and the caller's handler will disagree.
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const headerCollapsed = headerCollapsedProp ?? internalCollapsed
  const handleCollapseHeader =
    onCollapseHeader ?? (() => setInternalCollapsed(true))
  const handleExpandHeader =
    onExpandHeader ?? (() => setInternalCollapsed(false))
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
    <div className={styles.pageTop}>
      <Header
        tabs={tabs}
        activeUrl={activeUrl}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onBack={handleBack}
        headerCollapsed={headerCollapsed}
        onExpandHeader={handleExpandHeader}
        accountSlot={accountAction}
      />
      {!headerCollapsed && (
        <div className={styles.whiteCard}>
          {showObjectTabs && (
            <PageTabs
              tabs={objectTabs}
              selected={objectTab}
              onChange={onObjectTabChange}
            />
          )}
          {actionBar !== undefined && (
            <>
              {actionBar}
              <Divider />
            </>
          )}
          <PageTitle
            title={title}
            state={titleState}
            onCollapse={handleCollapseHeader}
          />
        </div>
      )}
    </div>
  )
}
