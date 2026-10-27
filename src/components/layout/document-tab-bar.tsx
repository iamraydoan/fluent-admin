import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  BarcodeScanner20Regular,
  Chat20Regular,
  ChevronDown20Regular,
  ChevronDown24Regular,
  ChevronLeft24Regular,
  Dismiss24Regular,
  Home24Regular,
  Search20Regular,
} from '@fluentui/react-icons'
import type { ShellTab } from '@/stores/shell-store'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Text } from '@/components/ui/text'
// Account data is the standard sidebar-data user (single source).
// The old menu-data ACCOUNT copy was deleted; initials 'SN' is now
// stored on sidebar-data.user itself, so the avatar fallback is
// unchanged (not 'S' derived from the name alone).
import { sidebarData } from '@/components/layout/data/sidebar-data'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { ThemeSwitch } from '@/components/theme-switch'
import { HEADER_GREY } from './shell-constants'

const useStyles = makeStyles({
  docTabBar: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    // 4px top + 44px tab = 48px strip, as in the reference; 8px right
    // padding, because the main area's 8px right margin already
    // contributes 8px, so the avatar's right edge still sits ~16px
    // from the viewport edge, as in the reference.
    padding: '4px 8px 0 16px',
    // Light keeps the exact HEADER_GREY strip (see the inline style
    // override in the component: dark swaps it for a dark token,
    // because no light token equals #e6e8eb).
    backgroundColor: HEADER_GREY,
  },
  // CHROME REDO (2026-10-27): full Chrome shape, NO BORDER AT ALL.
  // The two rejected rounds are NOT repeated: e913431 changed too
  // much layout, and 080a47c only painted 8x8 scoops INSIDE a
  // 1px-bordered white box, leaving a border hairline outside each
  // scoop and square grey inactive boxes with no hover. This round
  // therefore (a) deletes every border on active AND inactive tabs
  // — definition comes ONLY from fill vs strip contrast, never
  // from a stroke, outline or shadow edge; (b) draws the active
  // tab as the reference's full buildTabPath SVG (top radius 8,
  // bottom concave fillets 8 on BOTH sides, no stroke), so the
  // strip colour shows through at the sides and in the concave
  // bottom corners at 1x, not only in enlarged crops; (c) makes
  // inactive tabs pills (rounded all corners, inset 6px top/bottom
  // inside the unchanged 44px tab bounds) with a real hover pill;
  // (d) adds 1px x 18px separators centred in the 8px gap.
  //
  // ADAPTATION vs the reference (documented, not silent): the
  // reference's shape sides sit 8px inset from the tab's outer
  // edges, so content padded 8px from the OUTER edge would sit
  // exactly ON the fill edge (0px from the fill). To keep the
  // current 8px content-to-fill-edge gap, the active tab's content
  // row is padded 16px from the outer edge (8px fillet inset +
  // 8px visual gap). Consequence, accepted by the brief: the
  // active tab's OUTER width grows by 16px (border removal gives
  // back 2px, so net +14px vs the bordered box). Everything else
  // is unchanged: strip padding 4px 8px 0 16px, strip height
  // 48px, tab height 44px, gap 8px, 24px icons, Fluent close
  // Button, semibold active / regular inactive title. Deliberately
  // NOT copied from Chrome: fixed 200px width, 42px strip / 36px
  // shape height (shape height here is the current 44px), tab
  // overlap (the 8px gap is kept — separators sit INSIDE it),
  // 12px title / 16px icon / 22px close circle.
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
  docTabActiveSvg: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    display: 'block',
    pointerEvents: 'none',
  },
  // Content row: 16px outer padding = 8px fillet inset + the
  // current 8px visual gap to the fill edge (see above).
  docTabActiveContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
    boxSizing: 'border-box',
    padding: '0px 16px',
  },
  // Inactive tab root: transparent, no border. The pill (below)
  // is inset 6px top/bottom, so the pill is 32px tall inside the
  // unchanged 44px tab bounds, and the 8px gap between tabs and
  // the 44px height are untouched.
  docTabInactive: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
    boxSizing: 'border-box',
    padding: '0px 8px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground1,
  },
  // Inactive pill: rounded ALL corners, full tab width, inset
  // 6px top/bottom. Light fill #eef0f2 is slightly lighter than
  // the #e6e8eb strip (sampled from the reference image: strip
  // ~224, pill ~240). Dark fill is a low-opacity white wash over
  // the dark strip (see the inline style override), slightly
  // lighter than the strip without equalling the active fill's
  // full-height Chrome shape. No border, no stroke.
  docTabInactivePill: {
    position: 'absolute',
    top: '6px',
    bottom: '6px',
    left: '0px',
    right: '0px',
    borderRadius: '8px',
    backgroundColor: '#eef0f2',
    pointerEvents: 'none',
  },
  // Hover pill: a SECOND layer over the base pill, inset 6px
  // top/bottom and 8px left/right exactly as in the reference, so
  // the hover step is visible against the base pill (light:
  // rgba(255,255,255,0.5) over #eef0f2 composites to ~#f7f8f9;
  // dark: rgba(255,255,255,0.12) lightens the dark pill). Rendered
  // only while the tab is really hovered (React mouse state, so a
  // Playwright mouse hover shows it); there is no hover at all
  // in the rejected 080a47c version, so this is a pass/fail item.
  docTabHoverPill: {
    position: 'absolute',
    top: '6px',
    bottom: '6px',
    left: '8px',
    right: '8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  // Content sits above both pill layers.
  docTabInactiveContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '44px',
  },
  // Separator: 1px x 18px, reference colour #aeb4ba light, centred
  // in the 8px gap (right -4.5px puts its centre 4px past the tab
  // edge, i.e. the middle of the gap) and centred vertically in
  // the 44px tab ((44-18)/2 = 13px). It is a child of the tab, so
  // it adds no width and changes no spacing. Hidden when this tab
  // or the next tab is active or hovered, as in the reference.
  docTabSeparator: {
    position: 'absolute',
    top: '13px',
    right: '-4.5px',
    width: '1px',
    height: '18px',
    backgroundColor: '#aeb4ba',
    pointerEvents: 'none',
    zIndex: 2,
  },
  backButton: {
    alignSelf: 'center',
    marginBottom: '4px',
    flexShrink: 0,
  },
  // Even, tight spacing, 20px icons, centred, padded from the edge.
  docTabRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '8px',
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
// 0.552 / 0.448, but H is the current 44px tab height (not the
// reference's 36px) and W is the live measured tab width. Path
// order, as in the reference: concave bottom-left fillet
// (0,H) -> (R,H-R), left side up to (R,R), top-left round to
// (2R,0), top edge to (W-2R,0), top-right round to (W-R,R),
// right side down to (W-R,H-R), concave bottom-right fillet to
// (W,H), bottom edge straight back to (0,H). The bottom edge is
// full width, so the fill merges into the HeaderBlock below with
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
  showFirstIcon: boolean
  separatorVisible: boolean
  isDark: boolean
  onCloseTab: (url: string) => void
}

// Active tab as its own component so it can own a ResizeObserver
// (hooks cannot live in the tabs.map loop). The root width is set
// by the content row; the observer reports that width, the SVG
// viewBox is set to exactly that width x 44, and the path is
// rebuilt — the same measure-then-draw loop as the reference,
// which observes its tab list. Setting the width never changes
// the root width (the SVG is absolute), so the loop is stable.
function ChromeActiveTab({
  tab,
  showFirstIcon,
  separatorVisible,
  isDark,
  onCloseTab,
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
    <div ref={rootRef} className={styles.docTabActive} role='tab' aria-selected>
      <svg
        className={styles.docTabActiveSvg}
        width={tabWidth}
        height={44}
        viewBox={`0 0 ${tabWidth} 44`}
        aria-hidden='true'
      >
        <path
          d={buildTabPath(tabWidth, 44)}
          style={{ fill: tokens.colorNeutralBackground1 }}
          stroke='none'
        />
      </svg>
      <div className={styles.docTabActiveContent}>
        {showFirstIcon && <Home24Regular />}
        <Text weight='semibold'>{tab.title}</Text>
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
      </div>
      {separatorVisible && (
        <span
          className={styles.docTabSeparator}
          style={
            isDark ? { backgroundColor: 'rgba(255, 255, 255, 0.3)' } : undefined
          }
          aria-hidden='true'
        />
      )}
    </div>
  )
}

export type DocumentTabBarProps = {
  tabs: ShellTab[]
  activeUrl: string
  onSelectTab: (url: string) => void
  onCloseTab: (url: string) => void
  onBack: () => void
  headerCollapsed: boolean
  onExpandHeader: () => void
  // Optional account slot (Phase 2F): when a screen supplies it, it
  // REPLACES the unified SN avatar at the right of the strip; when
  // absent (every non-Clerk screen) the avatar renders exactly as
  // before. The slot is a plain ReactNode so this shared shell never
  // imports Clerk itself and never calls Clerk hooks: the only caller
  // is the Clerk user-management page, whose element is rendered
  // inside its ClerkProvider, so provider/key gating stays with that
  // page and the shared strip cannot crash on screens without Clerk.
  accountSlot?: ReactNode
}

// Multi-document tab strip, generalised from the MES single tab.
// One Back button at the start of the strip (goes to the preceding
// tab, or '/' when only one tab remains), then one tab per open
// document: the Home icon only on the first tab, every tab with its
// own Dismiss X. Active tab is the borderless Chrome SVG shape
// (Background1 fill, merging into the block below); inactive tabs
// are borderless pills, still readable. Right-hand icons keep the MES order:
// More, Scan, Search, Messages, account avatar.
export default function DocumentTabBar({
  tabs,
  activeUrl,
  onSelectTab,
  onCloseTab,
  onBack,
  headerCollapsed,
  onExpandHeader,
  accountSlot,
}: DocumentTabBarProps) {
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
  return (
    <div
      className={styles.docTabBar}
      style={
        isDark ? { backgroundColor: tokens.colorNeutralBackground2 } : undefined
      }
    >
      <Button
        appearance='transparent'
        size='small'
        className={styles.backButton}
        icon={<ChevronLeft24Regular />}
        aria-label='Back'
        onClick={onBack}
      />
      {tabs.map((tab, index) => {
        const isActive = tab.url === activeUrl
        const isHovered = hoveredUrl === tab.url
        const nextTab = tabs[index + 1]
        const nextIsActiveOrHovered =
          !!nextTab && (nextTab.url === activeUrl || nextTab.url === hoveredUrl)
        // Separator after this tab hides when this tab or the next
        // tab is active or hovered (reference rule); the last tab
        // keeps its separator (before the right-hand icons) unless
        // it is itself active or hovered.
        const separatorVisible =
          !isActive && !isHovered && !nextIsActiveOrHovered
        if (isActive) {
          return (
            <ChromeActiveTab
              key={tab.url}
              tab={tab}
              showFirstIcon={index === 0}
              separatorVisible={separatorVisible}
              isDark={isDark}
              onCloseTab={onCloseTab}
            />
          )
        }
        return (
          <div
            key={tab.url}
            className={styles.docTabInactive}
            onClick={() => onSelectTab(tab.url)}
            onMouseEnter={() => setHoveredUrl(tab.url)}
            onMouseLeave={() => setHoveredUrl(null)}
            role='tab'
            aria-selected={false}
          >
            <span
              className={styles.docTabInactivePill}
              style={
                isDark
                  ? { backgroundColor: 'rgba(255, 255, 255, 0.07)' }
                  : undefined
              }
              aria-hidden='true'
            />
            {isHovered && (
              <span
                className={styles.docTabHoverPill}
                style={
                  isDark
                    ? { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                    : undefined
                }
                aria-hidden='true'
              />
            )}
            <span className={styles.docTabInactiveContent}>
              {index === 0 && <Home24Regular />}
              <Text weight='regular'>{tab.title}</Text>
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
            </span>
            {separatorVisible && (
              <span
                className={styles.docTabSeparator}
                style={
                  isDark
                    ? { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                    : undefined
                }
                aria-hidden='true'
              />
            )}
          </div>
        )
      })}
      <div className={styles.docTabRight}>
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<ChevronDown20Regular />}
          aria-label='More options'
        />
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<BarcodeScanner20Regular />}
          aria-label='Scan'
        />
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<Search20Regular />}
          aria-label='Search'
          onClick={() => setOpen(true)}
        />
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<Chat20Regular />}
          aria-label='Messages'
        />
        {/* ThemeSwitch (compact, existing component): the single
            system-wide placement — every screen renders HeaderBlock
            -> DocumentTabBar, so one switch here changes the theme
            for the whole app. Sits between Messages and the account
            avatar, before the Expand header button below. */}
        <ThemeSwitch />
        {/* Account menu at the top-right, from the standard
            sidebar-data user (initials 'SN'). The menu itself holds
            NO user/footer (user decision, correct as-is); account
            lives here, not in the menu. Items replicate the original
            NavUser dropdown: Upgrade to Pro (plain item, no
            navigate, as in the original), Account ->
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
                  aria-label={`${sidebarData.user.name} (${sidebarData.user.email})`}
                  title={`${sidebarData.user.name} (${sidebarData.user.email})`}
                  style={{ padding: '0px', minWidth: '32px' }}
                >
                  <span className={styles.avatarWrap}>
                    <Avatar
                      name={sidebarData.user.name}
                      initials={sidebarData.user.initials}
                      image={{ src: sidebarData.user.avatar }}
                      size={32}
                      aria-label={`${sidebarData.user.name} (${sidebarData.user.email})`}
                    />
                  </span>
                </Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem>Upgrade to Pro</MenuItem>
                  <MenuDivider />
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
          <Button
            appearance='transparent'
            className={styles.topIconButton}
            icon={<ChevronDown24Regular />}
            aria-label='Expand header'
            onClick={onExpandHeader}
          />
        )}
      </div>
    </div>
  )
}
