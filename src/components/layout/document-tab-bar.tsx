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
  // Chrome tab shape, ported from the user's reference
  // (~/workspace/user/files/google_chrome_tab_ui.html, buildTabPath).
  // The tab container itself is transparent: the active tab's fill
  // comes only from the SVG path below, the inactive tab's hover
  // comes only from the pill below, so the grey strip shows through
  // everywhere else. Tabs overlap by 8px net (flex gap 8px plus
  // marginLeft -16px on every tab after the first, so the active
  // tab's concave bottom fillets sit over the neighbouring tab,
  // exactly like Chrome), and the active tab sits on top (zIndex 10).
  // The previous v13 bottom-right flare div is gone: it did not
  // look like the reference curve, and the SVG path below replaces
  // it on BOTH bottom corners, not just the right one.
  docTabChrome: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: '8px 8px 8px 8px',
    height: '44px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    flexShrink: 0,
    color: tokens.colorNeutralForeground1,
  },
  // Active tab SVG shape: absolute, fills the whole container, fill
  // is the header surface (Background1) so it merges into the white
  // block below, exactly like Chrome's white active tab merging
  // into its page. Content sits above it (see docTabContent).
  docTabSvg: {
    position: 'absolute',
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    display: 'block',
  },
  // Inactive tab hover pill, as in the reference: inset 6px top /
  // bottom and 8px left / right, 8px radius, transparent until hover.
  // Background is set inline from hover state (light white 0.5,
  // dark white 0.12), because the pill itself has pointerEvents none
  // and hover is tracked on the tab container.
  docTabPill: {
    position: 'absolute',
    top: '6px',
    bottom: '6px',
    left: '8px',
    right: '8px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: '0.12s',
    transitionTimingFunction: 'ease',
    pointerEvents: 'none',
    zIndex: 0,
  },
  // Tab content (icon + title + close X): in normal flow, so it
  // determines the container width that the SVG path is measured
  // from, and above the SVG / pill (zIndex 1). The reference puts
  // content absolute with a fixed tab width; ours is auto width, so
  // content must stay in flow, otherwise the container collapses.
  docTabContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 1,
    overflow: 'hidden',
  },
  // Chrome separator, as in the reference: 1px, 18px tall, centred
  // vertically, 4px from the tab's right edge. Rendered only between
  // tabs (never after the last tab) and hidden when this tab, the
  // next tab, or either's hover state touches the active tab, so it
  // never shows through an active tab's concave fillet.
  docTabSeparator: {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1px',
    height: '18px',
    backgroundColor: '#aeb4ba',
    zIndex: 1,
    pointerEvents: 'none',
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

// Chrome active-tab vector path, ported verbatim from the reference
// buildTabPath (google_chrome_tab_ui.html), with H adapted to our
// 44px tab height (reference H=36 for its 42px strip) and R=8.
// Path, in order: bottom-left concave fillet (0,H) -> (R,H-R),
// left edge up to (R,R), top-left rounded corner to (2R,0), top edge
// to (W-2R,0), top-right rounded corner to (W-R,R), right edge down
// to (W-R,H-R), bottom-right concave fillet to (W,H), bottom edge
// back to (0,H). The 0.552 / 0.448 factors are the standard cubic
// approximation for a quarter circle (0.5522847498, 1-0.552).
// R is clamped so a very narrow tab cannot invert the path.
function buildChromeTabPath(width: number, height = 44, radius = 8) {
  const W = Math.round(width)
  const H = height
  const R = Math.min(radius, Math.floor(W / 4), Math.floor(H / 4))
  if (R <= 0 || W <= 0) return ''
  return [
    `M 0,${H}`,
    `C ${R * 0.552},${H} ${R},${H - R * 0.448} ${R},${H - R}`,
    `L ${R},${R}`,
    `C ${R},${R * 0.448} ${R + R * 0.448},0 ${2 * R},0`,
    `L ${W - 2 * R},0`,
    `C ${W - R - R * 0.448},0 ${W - R},${R * 0.448} ${W - R},${R}`,
    `L ${W - R},${H - R}`,
    `C ${W - R},${H - R * 0.448} ${W - R * 0.448},${H} ${W},${H}`,
    'Z',
  ].join(' ')
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
// own Dismiss X. Active tab keeps the MES style (white, 8px top
// radius, #c8c8c8 border except the bottom); inactive tabs are flat
// grey but still readable. Right-hand icons keep the MES order:
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
  const { setOpen } = useSearch()
  // Dark palette mirrors the light relationships: strip mid-dark,
  // active tab the header surface (Background1) so it merges into
  // the block below, inactive tabs transparent with a light pill
  // on hover, as in the Chrome reference.
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  // Hover is tracked in React (not CSS :hover) so the pill and the
  // separator hide rule can both read it, and so a screenshot test
  // can hover a tab and verify the pill appears.
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null)
  // Active tab width, measured from the live DOM and kept current
  // with a ResizeObserver, exactly like the reference's
  // updateActiveSvgPath + ResizeObserver. Only the active tab needs
  // a path; inactive tabs render no SVG at all.
  const activeTabRef = useRef<HTMLDivElement | null>(null)
  const [activeTabWidth, setActiveTabWidth] = useState(0)
  useEffect(() => {
    const el = activeTabRef.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      if (w > 0) setActiveTabWidth(w)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [activeUrl, tabs])
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
        const nextIsActive = nextTab ? nextTab.url === activeUrl : false
        const nextIsHovered = nextTab ? hoveredUrl === nextTab.url : false
        // Separator: only between tabs, never after the last tab,
        // and hidden when this tab, the next tab, or either's hover
        // touches the active tab, as in the reference's :has() rules.
        const showSeparator =
          index < tabs.length - 1 &&
          !isActive &&
          !isHovered &&
          !nextIsActive &&
          !nextIsHovered
        return (
          <div
            key={tab.url}
            ref={isActive ? activeTabRef : undefined}
            className={styles.docTabChrome}
            style={{
              marginLeft: index === 0 ? '0px' : '-16px',
              zIndex: isActive ? 10 : 1,
            }}
            onClick={() => {
              if (!isActive) onSelectTab(tab.url)
            }}
            onMouseEnter={() => setHoveredUrl(tab.url)}
            onMouseLeave={() => setHoveredUrl(null)}
            role='tab'
            aria-selected={isActive}
          >
            {isActive ? (
              <svg
                className={styles.docTabSvg}
                viewBox={`0 0 ${activeTabWidth || 100} 44`}
                preserveAspectRatio='none'
                aria-hidden='true'
              >
                <path
                  d={buildChromeTabPath(activeTabWidth || 100)}
                  style={{ fill: tokens.colorNeutralBackground1 }}
                />
              </svg>
            ) : (
              <div
                className={styles.docTabPill}
                style={{
                  backgroundColor: isHovered
                    ? isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(255, 255, 255, 0.5)'
                    : 'transparent',
                }}
              />
            )}
            {showSeparator && <div className={styles.docTabSeparator} />}
            <div className={styles.docTabContent}>
              {index === 0 && <Home24Regular />}
              <Text weight={isActive ? 'semibold' : 'regular'}>
                {tab.title}
              </Text>
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
