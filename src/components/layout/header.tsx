import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  BarcodeScanner20Regular,
  bundleIcon,
  Chat20Regular,
  ChevronDown20Regular,
  ChevronDown24Regular,
  ChevronLeft24Regular,
  Dismiss24Regular,
  Home24Filled,
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
import { Tooltip } from '@/components/ui/tooltip'
// Account data is the standard navigation-data user (single source).
// The old menu-data ACCOUNT copy was deleted; initials 'SN' is now
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
    padding: '4px 8px 0 16px',
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
    top: '6px',
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
    marginTop: '6px',
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
  // 8px left/right exactly as in the reference, radius 8px.
  // Light: rgba(255,255,255,0.5) over the strip; dark: a
  // low-opacity white wash. Default fill is transparent, so a
  // non-hovered inactive tab shows pure strip colour.
  docTabHoverPill: {
    position: 'absolute',
    top: '6px',
    bottom: '6px',
    left: '8px',
    right: '8px',
    borderRadius: tokens.borderRadiusXLarge,
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
    marginTop: '6px',
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
    top: '12px',
    right: '-4px',
    width: '1px',
    height: '20px',
    backgroundColor: '#aeb4ba',
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
  showFirstIcon: boolean
  separatorVisible: boolean
  isDark: boolean
  onCloseTab: (url: string) => void
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
        {showFirstIcon && <HomeIcon filled />}
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
            isDark ? { backgroundColor: 'rgba(255, 255, 255, 0.3)' } : undefined
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
  // REPLACES the unified SN avatar at the right of the strip; when
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
// More, Scan, Search, Messages, account avatar.
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
                    ? { backgroundColor: 'rgba(255, 255, 255, 0.12)' }
                    : { backgroundColor: 'rgba(255, 255, 255, 0.5)' }
                  : undefined
              }
              aria-hidden='true'
            />
            <span className={styles.docTabInactiveContent}>
              {index === 0 && <HomeIcon />}
              <Text weight='regular'>{tab.title}</Text>
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
        <Tooltip content='More options' relationship='label'>
          <Button
            appearance='transparent'
            className={styles.topIconButton}
            icon={<ChevronDown20Regular />}
            aria-label='More options'
          />
        </Tooltip>
        <Tooltip content='Scan' relationship='label'>
          <Button
            appearance='transparent'
            className={styles.topIconButton}
            icon={<BarcodeScanner20Regular />}
            aria-label='Scan'
          />
        </Tooltip>
        <Tooltip content='Search' relationship='label'>
          <Button
            appearance='transparent'
            className={styles.topIconButton}
            icon={<Search20Regular />}
            aria-label='Search'
            onClick={() => setOpen(true)}
          />
        </Tooltip>
        <Tooltip content='Messages' relationship='label'>
          <Button
            appearance='transparent'
            className={styles.topIconButton}
            icon={<Chat20Regular />}
            aria-label='Messages'
          />
        </Tooltip>
        {/* ThemeSwitch (compact, existing component): the single
            system-wide placement — every screen renders PageTop
            -> Header, so one switch here changes the theme
            for the whole app. Sits between Messages and the account
            avatar, before the Expand header button below. */}
        <ThemeSwitch />
        {/* Account menu at the top-right, from the standard
            navigation-data user (initials 'SN'). The menu itself holds
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
    </div>
  )
}
