import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  bundleIcon,
  ChevronDown20Regular,
  ChevronDown24Regular,
  ChevronLeft24Regular,
  Dismiss24Regular,
  Home24Filled,
  Home24Regular,
  Search20Regular,
} from '@fluentui/react-icons'
import { sortedTabs, useShellStore, type ShellTab } from '@/stores/shell-store'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'
// Account data is the standard navigation-data user (single source).
// The old menu-data ACCOUNT copy was deleted; initials 'AU' is now
// stored on navigation-data.user itself, so the avatar fallback is
// unchanged (not 'S' derived from the name alone).
import { navigationData } from '@/components/layout/data/navigation-data'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { ThemeSwitch } from '@/components/theme-switch'
import { HEADER_GREY } from './shell-constants'

// Group 1 icons: first-tab Home is a Fluent bundle — Filled on the
// active tab, Regular on inactive tabs. Same 24px size/position.
const HomeIcon = bundleIcon(Home24Filled, Home24Regular)

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: tokens.spacingHorizontalS,
    // 4px top + 44px tab = 48px strip, as in the reference; 8px right
    // padding, because the main area's 8px right margin already
    // contributes 8px, so the avatar's right edge still sits ~16px
    // from the viewport edge, as in the reference.
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS} 0 ${tokens.spacingHorizontalL}`,
    // Light keeps the exact HEADER_GREY strip (see the inline style
    // override in the component: dark swaps it for a dark token,
    // because no light token equals #e6e8eb).
    backgroundColor: HEADER_GREY,
  },
  // CHROME REDO v3 (2026-10-27): fixes all four points of the
  // user's second rejection of c8a8ef6, by following the reference
  // (google_chrome_tab_ui.html) exactly instead of improvising:
  // (1) SEPARATOR: 1px, kept, but now pixel-verifiable — the v2
  // base pill filled each inactive tab edge-to-edge, so the gap
  // read as pill-grey against strip-grey and the 1px line drowned;
  // with the base pill deleted (point 2) the gap is pure strip
  // colour and the separator stands out. Height scaled from the
  // reference: 18px in a 42px strip x (48/42) = 20.6 -> 20px,
  // centred in the 44px tab (top 12px). Placement right -4px puts
  // the crisp 1px line at 4-5px past the tab edge, i.e. on the
  // centre of the 8px gap (true centre 4px, nearest whole pixel),
  // NOT -4.5px (subpixel, renders faint on two pixels at 1x).
  // (2) INACTIVE = NO BACKGROUND: the v2 base pill
  // (docTabInactivePill, #eef0f2 / dark wash) is DELETED. The
  // reference has no base layer at all — .tab-hover-pill is
  // transparent until hover. So default inactive = transparent,
  // strip shows through, icon/title/close only. Exactly ONE
  // visible layer ever: hover pill on hover, Chrome shape when
  // active, nothing otherwise.
  // (3) FIRST TAB DOUBLE BACKGROUND: same fix — v2 stacked base
  // pill + hover pill on the first tab. Now the first tab, like
  // every tab, has 0 layers default, 1 hover pill on hover,
  // 1 shape when active. No border anywhere, so no double edge.
  // (4) SPACING: v2 content sat 8px (inactive) / 16px (active)
  // from the tab outer edge — cramped on the left. Reference
  // .tab-content: left/right inset = fillet 8px + padding 10px
  // = 18px from the tab outer edge to the icon (and from the
  // close button to the tab outer edge). Both states now use
  // padding 0 18px, so left inset = right inset = 18px. Cost,
  // accepted: inactive tabs grow 20px wider (8->18 each side),
  // active tabs 4px wider (16->18 each side). Nothing else moves:
  // strip 48px, tab 44px, gap 8px, icon 24px, no fixed width,
  // no overlap, no 42px strip.
  // (5) HEIGHT MATCHING, per reference (see also the comment on
  // docTabActiveSvg): reference strip 42px — .tab-item height
  // 42, .tab-hover-pill top 6 bottom 6 (height 30), .tab-content
  // top 6 bottom 6 (height 30), .tab-svg-shape top 6 bottom 0
  // (height 36). So content height = hover pill height, same top
  // offset 6px, and the active shape extends 6px FURTHER DOWN
  // than pill/content ONLY to merge into the page below — that
  // difference is intentional, not a mismatch. Scaled to our
  // 44px tab: content and hover pill are top 6 / height 32
  // (44-12), active shape is top 6 / height 38 (44-6), bottom 0.
  // A tab switching inactive -> hovered -> active therefore
  // never moves its content vertically (top 6, height 32 in all
  // three states) and its top edge never jumps (top 6 in all
  // three states). v2 broke this: active content was full 44px
  // tall vs the 32px hover pill.
  //
  // ADAPTATION vs the reference (documented, not silent): the
  // reference overlaps tabs by -8px and uses a fixed 200px width;
  // we keep the current 8px gap and content-sized width, so
  // separators sit INSIDE the gap (see point 1) instead of at the
  // reference's right:4px inside an overlapped tab. Shape sides
  // sit 8px inset from the tab's outer edges at content height,
  // so 18px content padding = 8px fillet + 10px visual gap to
  // the fill edge, exactly as in the reference.
  //
  // Active tab root: transparent, no border, no shadow. Its size
  // comes from the content row in normal flow; the SVG shape is
  // absolutely positioned behind it and sized from the measured
  // root width (ResizeObserver in ChromeActiveTab below), so the
  // path's curves are never stretched by viewBox scaling.
  docTabActive: {
    position: 'relative',
    height: '44px',
    flexShrink: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground1,
  },
  // Active shape: top 6px, height 38px (44-6), bottom 0 — it
  // merges into the PageTop below, exactly like the
  // reference's top 6 / bottom 0 shape. It is TALLER than the
  // 32px hover pill / content BY DESIGN (see point 5 above):
  // the extra 6px is below the content, joining the page, never
  // above it, so the content top edge does not move.
  docTabActiveSvg: {
    position: 'absolute',
    top: tokens.spacingVerticalSNudge,
    left: '0px',
    display: 'block',
    pointerEvents: 'none',
  },
  // Content row: height 32px + margin-top 6px = reference
  // top 6 / bottom 6 inside the 44px tab, matching the hover
  // pill's height and top offset exactly. Padding 0 18px =
  // fillet 8px + 10px visual gap (point 4).
  docTabActiveContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '32px',
    marginTop: tokens.spacingVerticalSNudge,
    boxSizing: 'border-box',
    padding: '0px 18px',
  },
  // Inactive tab root: transparent, no border, NO base pill.
  // Padding lives on the content row (point 4), not the root,
  // so the root width is exactly the content width.
  docTabInactive: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    height: '44px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground1,
  },
  // Hover pill: the ONLY background an inactive tab ever gets,
  // and only while hovered. Rendered always (as in the
  // reference, where .tab-hover-pill exists with a transparent
  // fill until :hover) so hovering adds exactly one layer and
  // never remounts or shifts content. Inset 6px top/bottom and
  // 8px left/right exactly as in the reference, radius Medium (4px)
  // per the Fluent 2 checklist mapping (ws6).
  // Light: rgba(255,255,255,0.5) over the strip; dark: a
  // low-opacity white wash. Default fill is transparent, so a
  // non-hovered inactive tab shows pure strip colour.
  docTabHoverPill: {
    position: 'absolute',
    top: tokens.spacingVerticalSNudge,
    bottom: tokens.spacingVerticalSNudge,
    left: tokens.spacingHorizontalS,
    right: tokens.spacingHorizontalS,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    zIndex: 1,
  },
  // Content sits above the hover pill. Height 32px + margin-top
  // 6px = same top offset and height as the hover pill and as
  // the active content (point 5), so state switches never move
  // it vertically. Padding 0 18px = fillet 8px + 10px (point 4).
  docTabInactiveContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    height: '32px',
    marginTop: tokens.spacingVerticalSNudge,
    boxSizing: 'border-box',
    padding: '0px 18px',
  },
  // Separator: 1px x 20px (scaled, see point 1), reference
  // colour #aeb4ba light, centred in the 8px gap (right -4px)
  // and centred vertically in the 44px tab (top 12px). It is a
  // child of the tab, so it adds no width and changes no
  // spacing. Hidden when this tab or the next tab is active or
  // hovered, as in the reference. zIndex 3 keeps it above the
  // hover pill and content of neighbouring tabs.
  docTabSeparator: {
    position: 'absolute',
    top: tokens.spacingVerticalM,
    right: '-4px',
    width: tokens.strokeWidthThin,
    height: tokens.spacingVerticalXL,
    backgroundColor: '#aeb4ba', // No Fluent token equals #aeb4ba; nearest stroke tokens are #d1d1d1 / #616161, so the separator grey is kept, not shifted.
    pointerEvents: 'none',
    zIndex: 3,
  },
  backButton: {
    alignSelf: 'center',
    marginBottom: tokens.spacingVerticalXS,
    flexShrink: 0,
  },
  // Even, tight spacing, 20px icons, centred, padded from the edge.
  docTabRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingRight: '0px',
    flexShrink: 0,
  },
  topIconButton: {
    minWidth: '32px',
    width: '32px',
    height: '32px',
    padding: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '0px',
    flexShrink: 0,
  },
})

// Full Chrome tab path, adapted from the reference buildTabPath
// (google_chrome_tab_ui.html): same R=8, same cubic factors
// 0.552 / 0.448, but H is 38px (44px tab minus the 6px top inset
// of the reference shape, bottom 0 so it merges below — see the
// height-matching comment on docTabActiveSvg) and W is the live
// measured tab width. Path
// order, as in the reference: concave bottom-left fillet
// (0,H) -> (R,H-R), left side up to (R,R), top-left round to
// (2R,0), top edge to (W-2R,0), top-right round to (W-R,R),
// right side down to (W-R,H-R), concave bottom-right fillet to
// (W,H), bottom edge straight back to (0,H). The bottom edge is
// full width, so the fill merges into the PageTop below with
// no gap and no border; the strip colour shows in the two
// concave corner triangles outside the path. No stroke ever.
function buildTabPath(width: number, height: number): string {
  const r = 8
  const w = Math.round(width)
  const h = height
  if (w <= 2 * r) return ''
  return [
    `M 0,${h}`,
    `C ${r * 0.552},${h} ${r},${h - r * 0.448} ${r},${h - r}`,
    `L ${r},${r}`,
    `C ${r},${r * 0.448} ${r + r * 0.448},0 ${2 * r},0`,
    `L ${w - 2 * r},0`,
    `C ${w - r - r * 0.448},0 ${w - r},${r * 0.448} ${w - r},${r}`,
    `L ${w - r},${h - r}`,
    `C ${w - r},${h - r * 0.448} ${w - r * 0.448},${h} ${w},${h}`,
    'Z',
  ].join(' ')
}

type ChromeActiveTabProps = {
  tab: ShellTab
  // Entity icon to render before the label, or undefined when the
  // tab has none. The caller already applied the first-tab Home
  // fallback (first displayed tab with no icon gets Home), so this
  // component never duplicates Home beside an entity icon.
  tabIcon?: React.ElementType
  isPinned: boolean
  isDirtyTab: boolean
  separatorVisible: boolean
  isDark: boolean
  onCloseTab: (url: string) => void
  onContextMenuTab: (url: string, event: React.MouseEvent) => void
}

// Active tab as its own component so it can own a ResizeObserver
// (hooks cannot live in the tabs.map loop). The root width is set
// by the content row; the observer reports that width, the SVG
// viewBox is set to exactly that width x 38, and the path is
// rebuilt — the same measure-then-draw loop as the reference,
// which observes its tab list. Setting the width never changes
// the root width (the SVG is absolute), so the loop is stable.
function ChromeActiveTab({
  tab,
  tabIcon: TabIcon,
  isPinned,
  isDirtyTab,
  separatorVisible,
  isDark,
  onCloseTab,
  onContextMenuTab,
}: ChromeActiveTabProps) {
  const styles = useStyles()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [tabWidth, setTabWidth] = useState(0)
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const update = () => {
      const w = el.getBoundingClientRect().width
      setTabWidth((prev) => (prev === w ? prev : w))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={rootRef}
      className={styles.docTabActive}
      role='tab'
      aria-selected
      aria-label={`${tab.title}${isPinned ? ' (pinned)' : ''}${isDirtyTab ? ' (unsaved changes)' : ''}`}
      data-pinned={isPinned ? 'true' : undefined}
      onContextMenu={(e) => onContextMenuTab(tab.url, e)}
    >
      <svg
        className={styles.docTabActiveSvg}
        width={tabWidth}
        height={38}
        viewBox={`0 0 ${tabWidth} 38`}
        aria-hidden='true'
      >
        <path
          d={buildTabPath(tabWidth, 38)}
          style={{ fill: tokens.colorNeutralBackground1 }}
          stroke='none'
        />
      </svg>
      <div className={styles.docTabActiveContent}>
        {/* Entity icon (Filled on the active tab, as Home was).
            Every navigation leaf icon is a Fluent bundle, so the
            filled prop is valid for all of them; tabs with no
            navigation icon render no icon here. */}
        {TabIcon && <TabIcon filled />}
        <Text weight='semibold'>{tab.title}</Text>
        <Tooltip content={`Close tab ${tab.title}`} relationship='label'>
          <Button
            appearance='transparent'
            size='small'
            icon={<Dismiss24Regular />}
            aria-label={`Close tab ${tab.title}`}
            onClick={(e) => {
              e.stopPropagation()
              onCloseTab(tab.url)
            }}
          />
        </Tooltip>
      </div>
      {separatorVisible && (
        <span
          className={styles.docTabSeparator}
          style={
            isDark
              ? {
                  backgroundColor:
                    'rgba(255, 255, 255, 0.3)' /* No token for a 0.3 white wash (Alpha is 0.5, Alpha2 0.8); kept, not shifted. */,
                }
              : undefined
          }
          aria-hidden='true'
        />
      )}
    </div>
  )
}

export type HeaderProps = {
  tabs: ShellTab[]
  activeUrl: string
  onSelectTab: (url: string) => void
  onCloseTab: (url: string) => void
  onBack: () => void
  headerCollapsed: boolean
  onExpandHeader: () => void
  // Optional account slot (Phase 2F): when a screen supplies it, it
  // REPLACES the unified AU avatar at the right of the strip; when
  // absent (every non-Clerk screen) the avatar renders exactly as
  // before. The slot is a plain ReactNode so this shared shell never
  // imports Clerk itself and never calls Clerk hooks: the only caller
  // is the Clerk user-management page, whose element is rendered
  // inside its ClerkProvider, so provider/key gating stays with that
  // page and the shared strip cannot crash on screens without Clerk.
  accountSlot?: ReactNode
}

// Multi-tab strip, generalised from the MES single tab.
// One Back button at the start of the strip (goes to the preceding
// tab, or '/' when only one tab remains), then one tab per open
// document: the Home icon only on the first tab, every tab with its
// own Dismiss X. Active tab is the borderless Chrome SVG shape
// (Background1 fill, merging into the block below); inactive tabs
// are borderless and transparent by default, with a single hover
// pill on hover. Right-hand icons keep the MES order:
// More, Search, ThemeSwitch, account avatar.
export default function Header({
  tabs,
  activeUrl,
  onSelectTab,
  onCloseTab,
  onBack,
  headerCollapsed,
  onExpandHeader,
  accountSlot,
}: HeaderProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [signOutOpen, setSignOutOpen] = useState(false)
  // Real hover state for inactive tabs: drives the hover pill
  // and separator hiding (a tab's separator hides when it, or the
  // tab after it, is active or hovered, as in the reference).
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null)
  const { setOpen } = useSearch()
  // Dark palette mirrors the light relationships: strip mid-dark,
  // inactive tab darker than the strip, active tab the header
  // surface (Background1) so it merges into the block below.
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  // Tab-strip state owned by the shell store: pin/dirty actions
  // and the close-others/close-all actions live here (not in
  // PageTop, which only handles single-tab close navigation).
  const dirtyMap = useShellStore((state) => state.dirty)
  const isTabDirty = useShellStore((state) => state.isDirty)
  const pinTab = useShellStore((state) => state.pinTab)
  const unpinTab = useShellStore((state) => state.unpinTab)
  const closeOthers = useShellStore((state) => state.closeOthers)
  const closeAll = useShellStore((state) => state.closeAll)
  // Display order: pinned tabs first (stable, insertion order
  // inside each block). The tabs prop itself stays in insertion
  // order, so Back/close navigation in PageTop is unchanged.
  const displayTabs = sortedTabs(tabs)
  // Right-click context menu: Fluent Menu anchors to a trigger
  // element, not to cursor coordinates, so the menu is anchored
  // to a 1px fixed span placed at the click point. The More
  // (chevron) button in docTabRight uses a normal uncontrolled
  // MenuTrigger instead, targeting the active tab.
  const [contextTarget, setContextTarget] = useState<string | null>(null)
  const [contextAnchor, setContextAnchor] = useState<{
    x: number
    y: number
  } | null>(null)
  const closeContextMenu = () => {
    setContextTarget(null)
    setContextAnchor(null)
  }
  const handleTabContextMenu = (url: string, event: React.MouseEvent) => {
    event.preventDefault()
    setContextTarget(url)
    setContextAnchor({ x: event.clientX, y: event.clientY })
  }
  // Dirty guard: closing a dirty tab (X, Close, Close Others,
  // Close All) first opens the confirm dialog; cancelling keeps
  // every tab open, because nothing is closed until confirm.
  type PendingClose = { kind: 'single' | 'others' | 'all'; url: string }
  const [pendingClose, setPendingClose] = useState<PendingClose | null>(null)
  const closeTargets = (kind: PendingClose['kind'], url: string): string[] => {
    if (kind === 'single') return [url]
    if (kind === 'others')
      return tabs.filter((t) => t.url !== url && !t.pinned).map((t) => t.url)
    return tabs.filter((t) => !t.pinned).map((t) => t.url)
  }
  const executeClose = (kind: PendingClose['kind'], url: string) => {
    if (kind === 'single') {
      onCloseTab(url)
      return
    }
    // closeOthers/closeAll return the url to navigate to; only
    // navigate when the active tab was among the closed tabs.
    const next = kind === 'others' ? closeOthers(url) : closeAll()
    if (next !== activeUrl) navigate({ to: next })
  }
  const requestClose = (kind: PendingClose['kind'], url: string) => {
    closeContextMenu()
    const dirtyTargets = closeTargets(kind, url).filter((target) =>
      isTabDirty(target)
    )
    if (dirtyTargets.length > 0) {
      setPendingClose({ kind, url })
    } else {
      executeClose(kind, url)
    }
  }
  const pendingDirtyCount = pendingClose
    ? closeTargets(pendingClose.kind, pendingClose.url).filter((target) =>
        isTabDirty(target)
      ).length
    : 0
  const pendingTargetTitle =
    pendingClose?.kind === 'single'
      ? (tabs.find((t) => t.url === pendingClose.url)?.title ?? '')
      : ''
  // Shared menu items for the right-click menu and the More
  // button. Pin/Unpin flips the store flag; display order
  // (sortedTabs) moves the tab, and unpin restores its place.
  const renderTabMenuItems = (targetUrl: string | null) => {
    if (!targetUrl) return null
    const target = tabs.find((t) => t.url === targetUrl)
    const pinned = target?.pinned === true
    return (
      <>
        <MenuItem onClick={() => requestClose('single', targetUrl)}>
          Close
        </MenuItem>
        <MenuItem onClick={() => requestClose('others', targetUrl)}>
          Close Others
        </MenuItem>
        <MenuItem onClick={() => requestClose('all', targetUrl)}>
          Close All
        </MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            closeContextMenu()
            if (pinned) unpinTab(targetUrl)
            else pinTab(targetUrl)
          }}
        >
          {pinned ? 'Unpin Tab' : 'Pin Tab'}
        </MenuItem>
      </>
    )
  }
  return (
    <div
      className={styles.header}
      style={
        isDark ? { backgroundColor: tokens.colorNeutralBackground2 } : undefined
      }
    >
      <Tooltip content='Back' relationship='label'>
        <Button
          appearance='transparent'
          size='small'
          className={styles.backButton}
          icon={<ChevronLeft24Regular />}
          aria-label='Back'
          onClick={onBack}
        />
      </Tooltip>
      {displayTabs.map((tab, index) => {
        const isActive = tab.url === activeUrl
        const isHovered = hoveredUrl === tab.url
        const nextTab = displayTabs[index + 1]
        const nextIsActiveOrHovered =
          !!nextTab && (nextTab.url === activeUrl || nextTab.url === hoveredUrl)
        // Separator after this tab hides when this tab or the next
        // tab is active or hovered (reference rule); the last tab
        // keeps its separator (before the right-hand icons) unless
        // it is itself active or hovered.
        const separatorVisible =
          !isActive && !isHovered && !nextIsActiveOrHovered
        // Entity icon: the tab's navigation icon, or Home for the
        // first displayed tab when it has none. Never both: a
        // Dashboard first tab already carries Home as its icon,
        // so the fallback must not add a second Home beside it.
        const TabIcon = tab.icon ?? (index === 0 ? HomeIcon : undefined)
        const isPinned = tab.pinned === true
        const isDirtyTab = dirtyMap[tab.url] === true
        const tabLabel = `${tab.title}${isPinned ? ' (pinned)' : ''}${isDirtyTab ? ' (unsaved changes)' : ''}`
        if (isActive) {
          return (
            <ChromeActiveTab
              key={tab.url}
              tab={tab}
              tabIcon={TabIcon}
              isPinned={isPinned}
              isDirtyTab={isDirtyTab}
              separatorVisible={separatorVisible}
              isDark={isDark}
              onCloseTab={(url) => requestClose('single', url)}
              onContextMenuTab={handleTabContextMenu}
            />
          )
        }
        return (
          <div
            key={tab.url}
            className={styles.docTabInactive}
            onClick={() => onSelectTab(tab.url)}
            onContextMenu={(e) => handleTabContextMenu(tab.url, e)}
            onMouseEnter={() => setHoveredUrl(tab.url)}
            onMouseLeave={() => setHoveredUrl(null)}
            role='tab'
            aria-selected={false}
            aria-label={tabLabel}
            data-pinned={isPinned ? 'true' : undefined}
          >
            {/* Hover pill: the ONLY background layer an inactive
                tab ever gets. Always rendered with a transparent
                fill when not hovered (reference behaviour), so
                hovering adds exactly one layer and the default
                state shows pure strip colour — no base pill. */}
            <span
              className={styles.docTabHoverPill}
              style={
                isHovered
                  ? isDark
                    ? {
                        backgroundColor:
                          'rgba(255, 255, 255, 0.12)' /* No token for a 0.12 white wash; kept, not shifted. */,
                      }
                    : { backgroundColor: tokens.colorNeutralBackgroundAlpha }
                  : undefined
              }
              aria-hidden='true'
            />
            <span className={styles.docTabInactiveContent}>
              {/* Entity icon (Regular on inactive tabs). Same
                  bundle rule as the active tab: every navigation
                  leaf icon is a bundle, so no filled prop here
                  renders its Regular variant. */}
              {TabIcon && <TabIcon />}
              <Text weight='regular'>{tab.title}</Text>
              <Tooltip content={`Close tab ${tab.title}`} relationship='label'>
                <Button
                  appearance='transparent'
                  size='small'
                  icon={<Dismiss24Regular />}
                  aria-label={`Close tab ${tab.title}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    requestClose('single', tab.url)
                  }}
                />
              </Tooltip>
            </span>
            {separatorVisible && (
              <span
                className={styles.docTabSeparator}
                style={
                  isDark
                    ? {
                        backgroundColor:
                          'rgba(255, 255, 255, 0.3)' /* No token for a 0.3 white wash (Alpha is 0.5, Alpha2 0.8); kept, not shifted. */,
                      }
                    : undefined
                }
                aria-hidden='true'
              />
            )}
          </div>
        )
      })}
      <div className={styles.docTabRight}>
        {/* More menu for the active tab (same items as the
            right-click menu). No Tooltip wrapper here on purpose:
            Tooltip and MenuTrigger both clone their child, and
            stacking them breaks the trigger ref; the button keeps
            its aria-label and title instead. */}
        <Menu>
          <MenuTrigger>
            <Button
              appearance='transparent'
              className={styles.topIconButton}
              icon={<ChevronDown20Regular />}
              aria-label='More options'
              title='More options'
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>{renderTabMenuItems(activeUrl || null)}</MenuList>
          </MenuPopover>
        </Menu>
        <Tooltip content='Search' relationship='label'>
          <Button
            appearance='transparent'
            className={styles.topIconButton}
            icon={<Search20Regular />}
            aria-label='Search'
            onClick={() => setOpen(true)}
          />
        </Tooltip>
        {/* ThemeSwitch (compact, existing component): the single
            system-wide placement — every screen renders PageTop
            -> Header, so one switch here changes the theme
            for the whole app. Sits between Search and the account
            avatar, before the Expand header button below. */}
        <ThemeSwitch />
        {/* Account menu at the top-right, from the standard
            navigation-data user (initials 'AU'). The menu itself holds
            NO user/footer (user decision, correct as-is); account
            lives here, not in the menu. Items replicate the original
            NavUser dropdown minus the dead upgrade item
            (removed: plain item, no handler): Account ->
            /settings/account, Billing -> /settings (the original
            Billing link pointed at /settings, preserved here),
            Notifications -> /settings/notifications, separator,
            Sign out -> the existing SignOutDialog (auth.reset +
            navigate to /sign-in with redirect, unchanged).
            When accountSlot is supplied (Clerk route only) this
            whole menu is NOT rendered, so it never duplicates the
            Clerk UserButton's own menu/sign-out. The original
            avatar image path is kept, with initials fallback: that
            file does not exist in this repo's public/ folder today,
            so initials render until the asset is added. Name +
            email are the accessible label and tooltip. */}
        {accountSlot ?? (
          <>
            <Menu>
              <MenuTrigger>
                <Button
                  appearance='transparent'
                  aria-label={`${navigationData.user.name} (${navigationData.user.email})`}
                  title={`${navigationData.user.name} (${navigationData.user.email})`}
                  style={{ padding: '0px', minWidth: '32px' }}
                >
                  <span className={styles.avatarWrap}>
                    <Avatar
                      name={navigationData.user.name}
                      initials={navigationData.user.initials}
                      image={{ src: navigationData.user.avatar }}
                      size={32}
                      aria-label={`${navigationData.user.name} (${navigationData.user.email})`}
                    />
                  </span>
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    onClick={() => navigate({ to: '/settings/account' })}
                  >
                    Account
                  </MenuItem>
                  <MenuItem onClick={() => navigate({ to: '/settings' })}>
                    Billing
                  </MenuItem>
                  <MenuItem
                    onClick={() => navigate({ to: '/settings/notifications' })}
                  >
                    Notifications
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => setSignOutOpen(true)}>
                    Sign out
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
            <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
          </>
        )}
        {headerCollapsed && (
          <Tooltip content='Expand header' relationship='label'>
            <Button
              appearance='transparent'
              className={styles.topIconButton}
              icon={<ChevronDown24Regular />}
              aria-label='Expand header'
              onClick={onExpandHeader}
            />
          </Tooltip>
        )}
      </div>
      {/* Right-click tab menu, anchored to the click point (see
          the state comment above). Rendered only while open, so
          the anchor span never lingers in the layout. */}
      {contextTarget && contextAnchor && (
        <Menu
          open
          onOpenChange={(_, data) => {
            if (!data.open) closeContextMenu()
          }}
        >
          <MenuTrigger>
            <span
              aria-hidden='true'
              style={{
                position: 'fixed',
                left: `${contextAnchor.x}px`,
                top: `${contextAnchor.y}px`,
                width: '1px',
                height: '1px',
                pointerEvents: 'none',
              }}
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>{renderTabMenuItems(contextTarget)}</MenuList>
          </MenuPopover>
        </Menu>
      )}
      {/* Dirty guard: shown by requestClose whenever any target
          tab is dirty. Confirm closes (dirty flags are cleared by
          the store close actions); cancel only clears the pending
          request, so every tab stays open. This is a Fluent Dialog
          (via the ui/dialog wrapper), NOT the shared plain-div
          ConfirmDialog, on purpose: the guard can appear while a
          Fluent Dialog/Drawer form is open, and Fluent's portal
          layer sits at z-index 1000000 — a plain z-1000 overlay
          paints below it and its buttons are unreachable (the
          modal backdrop intercepts pointer events, verified in
          Playwright). A Fluent Dialog renders in the same portal
          layer, above the form modal, and stays clickable. */}
      <Dialog
        open={pendingClose !== null}
        onOpenChange={(_, data) => {
          if (!data.open) setPendingClose(null)
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Unsaved changes</DialogTitle>
            <DialogContent>
              {pendingClose?.kind === 'single'
                ? `Tab "${pendingTargetTitle}" has unsaved changes. Close it without saving?`
                : `${pendingDirtyCount} tab${pendingDirtyCount === 1 ? '' : 's'} have unsaved changes. Close them without saving?`}
            </DialogContent>
            <DialogActions>
              <Button
                appearance='secondary'
                onClick={() => setPendingClose(null)}
              >
                Keep open
              </Button>
              <Button
                appearance='primary'
                onClick={() => {
                  if (pendingClose)
                    executeClose(pendingClose.kind, pendingClose.url)
                  setPendingClose(null)
                }}
              >
                Close without saving
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}
