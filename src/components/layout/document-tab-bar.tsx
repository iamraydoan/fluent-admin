import { useState, type ReactNode } from 'react'
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
  // SCOPE (user note 2026-10-27): ONLY the rounded method and the
  // idea are borrowed from the Chrome reference
  // (~/workspace/user/files/google_chrome_tab_ui.html). Spacing and
  // size stay exactly like the current (pre-Chrome) version: strip
  // padding 4px 8px 0 16px, strip gap 8px, tab height 44px, tab
  // padding 8px, tab gap 8px, 24px icons, Fluent close Button,
  // semibold active / regular inactive title. The full Chrome
  // strip was REJECTED for changing that layout, so the following
  // Chrome elements are DELIBERATELY NOT applied: tab overlap
  // (would erase the current 8px gap between tabs), transparent
  // inactive tabs, hover pill, separators, 42px strip / 36px shape,
  // 12px title / 16px icon / 22px close circle, fixed 200px tab
  // width. Inactive tabs are therefore completely untouched below.
  //
  // Active tab only, and only its bottom corners change: the tab
  // keeps its current white box, 1px border (except bottom), 8px
  // top radius, shadow, padding, height and gap, and gains the
  // reference's bottom concave fillets (R=8) as two 8x8 corner
  // scoops (see CHROME_FILLET_* below) painted in the strip colour
  // over the box's bottom corners, so the fill still merges into
  // the white block below exactly like Chrome's active tab.
  // Why scoops instead of the reference's full SVG tab path? The
  // full path was tried first in this task and measured: its sides
  // sit 8px inset, so the visible white fill narrows by 16px and
  // the title / close X edge margin drops from 8px to 0px for
  // icon-less tabs (e.g. Users) — a spacing change the user
  // explicitly forbade. Scoops apply the same R=8 concave curve at
  // the bottom corners only, with zero change to fill width,
  // content margins, or any other size.
  docTab: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: 'none',
    borderRadius: '8px 8px 0 0',
    boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.06)',
    padding: '8px 8px 8px 8px',
    height: '44px',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  // Bottom concave fillet scoops for the active tab: 8x8, pinned
  // to the tab's bottom corners, painted in the strip colour (set
  // inline: HEADER_GREY light, Background2 dark, matching the
  // strip itself). They sit over the white box only in the curved
  // triangle at each bottom corner (the SVG path's other pixels
  // are transparent), so the tab's bottom edge stays full width
  // and merged into the block below, while each side edge curves
  // outward at the bottom exactly like the reference fillet.
  // pointerEvents none, so clicks still hit the tab. They never
  // overlap content: content lives in the padded row above
  // (8px padding, 44px tab), the scoops in the bottom 8px.
  docTabFilletLeft: {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    width: '8px',
    height: '8px',
    pointerEvents: 'none',
    display: 'block',
  },
  docTabFilletRight: {
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    width: '8px',
    height: '8px',
    pointerEvents: 'none',
    display: 'block',
  },
  // Inactive tab: same shape, but a flat grey fill (darker than the
  // strip so the tab shape still reads) and no shadow, so only the
  // active tab merges into the white block below. Light keeps the
  // exact #d9dcdf (see the inline style override: dark swaps it for
  // a darker-than-strip token, mirroring the light relationship).
  docTabInactive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#d9dcdf',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: 'none',
    borderRadius: '8px 8px 0 0',
    padding: '8px 8px 8px 8px',
    height: '44px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
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

// Chrome bottom concave fillet curves, taken from the reference
// buildTabPath (google_chrome_tab_ui.html) fillet segments, R=8,
// cubic factors 0.552 / 0.448, reused as the boundary of each
// corner scoop (local 8x8 square, origin at the square's top
// corner toward the tab centre). Left scoop: the reference's
// bottom-left fillet, from (8,0) to (0,8) in local coords, i.e.
// the quarter circle centred on the square's top-left corner;
// the painted region is the curved triangle between the square's
// top edge, its outer edge, and that arc. Right scoop is the
// mirror image. The tab's bottom edge is NOT part of either path,
// so it stays full width and merged into the block below.
const CHROME_FILLET_LEFT = 'M 0,0 L 8,0 C 8,4.416 4.416,8 0,8 Z'
const CHROME_FILLET_RIGHT = 'M 8,0 L 0,0 C 0,4.416 3.584,8 8,8 Z'

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
        return (
          <div
            key={tab.url}
            className={isActive ? styles.docTab : styles.docTabInactive}
            style={
              !isActive && isDark
                ? { backgroundColor: tokens.colorNeutralBackground3 }
                : undefined
            }
            onClick={() => {
              if (!isActive) onSelectTab(tab.url)
            }}
            role='tab'
            aria-selected={isActive}
          >
            {isActive && (
              <>
                <svg
                  className={styles.docTabFilletLeft}
                  width='8'
                  height='8'
                  viewBox='0 0 8 8'
                  aria-hidden='true'
                >
                  <path
                    d={CHROME_FILLET_LEFT}
                    style={{
                      fill: isDark
                        ? tokens.colorNeutralBackground2
                        : HEADER_GREY,
                    }}
                  />
                </svg>
                <svg
                  className={styles.docTabFilletRight}
                  width='8'
                  height='8'
                  viewBox='0 0 8 8'
                  aria-hidden='true'
                >
                  <path
                    d={CHROME_FILLET_RIGHT}
                    style={{
                      fill: isDark
                        ? tokens.colorNeutralBackground2
                        : HEADER_GREY,
                    }}
                  />
                </svg>
              </>
            )}
            {index === 0 && <Home24Regular />}
            <Text weight={isActive ? 'semibold' : 'regular'}>{tab.title}</Text>
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
