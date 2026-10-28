import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ChevronDown20Regular,
  ChevronRight20Regular,
  Navigation20Regular,
} from '@fluentui/react-icons'
import { useShellStore } from '@/stores/shell-store'
import { DEMO_ENVIRONMENT } from '@/lib/demo-environment'
import {
  NAV_VISIBILITY_CHANGED_EVENT,
  loadNavVisibility,
  navVisibilityIdForTitle,
  type NavVisibility,
} from '@/lib/nav-visibility'
import { Button } from '@/components/ui/button'
import { Nav, NavItem, NavSectionHeader } from '@/components/ui/nav'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'
// Menu data is the standard navigation-data (single source, shared
// with command-menu): the old mes-agent/menu-data.ts parallel copy
// was deleted. navigation-data.navGroups is used directly — teams
// are NOT rendered here, as before (account lives only in the
// header avatar, see Header), only navGroups + their
// titles/urls/badges/icons.
import { navigationData } from '@/components/layout/data/navigation-data'
import type { NavigationItem } from '@/components/layout/types'

// Fluent Nav menu, in demo style. No third-party utility classes are
// used here, and there is no team/user footer (account lives in the
// header avatar only, see Header).
// Menu items come from navigation-data.navGroups (the standard source);
// the old menu-data MENU_GROUPS copy was deleted, so titles, urls,
// badges, order and groups must stay identical to navigation-data —
// the only intentional change vs the old copy is icons, which now
// follow navigation-data (e.g. Secured by Clerk uses the local
// ClerkLogo SVG, Errors/Settings sub-items use their specific
// Fluent icons instead of the generic ones the copy used).
//
// Grouping choice, documented: Fluent NavCategory exists in the
// installed version, but its controlled open/selected semantics made
// navigation vs expansion ambiguous in testing, so groups are rendered
// as NavSectionHeader + NavItems, with parent items expanding to
// indented NavItems. That fallback is explicitly allowed by the brief
// and keeps every destination reachable with deterministic behaviour:
// clicking a parent toggles its sub-items, clicking a leaf navigates.
// In collapsed (icon-only) mode, clicking a parent icon expands the
// whole menu and opens that parent, so its sub-items become reachable
// instead of being hidden behind an icon with no label.

const MENU_WIDTH_EXPANDED = '232px'
const MENU_WIDTH_COLLAPSED = '64px'

const useStyles = makeStyles({
  menu: {
    flexShrink: 0,
    height: '100vh',
    // Theme token, not a hardcoded white: light resolves to #ffffff
    // (unchanged), dark to the dark surface so menu text stays readable.
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    // 8px left inset, as in the demo rail and Details View: the active
    // bar sits 8px from the menu edge, not flush to it, while the
    // bar-to-icon/text gap stays ~13px.
    paddingLeft: tokens.spacingHorizontalS,
    // Single selected-item bar, demo technique: 3px x 20px brand blue,
    // centred, no fill. Fluent Nav's own ::after is hidden, otherwise
    // the selected item shows two bars.
    '& [aria-current="page"]': {
      backgroundImage: `linear-gradient(${tokens.colorBrandBackground}, ${tokens.colorBrandBackground})`,
      backgroundSize: '3px 20px',
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'transparent',
      // Thinning: the active item is marked by the 3px brand bar +
      // brand colour, not by weight. Fluent NavItem renders the
      // selected item semibold by default; force regular here (and
      // on its descendants, where Fluent applies the weight) so the
      // active label reads the same weight as inactive labels.
      fontWeight: tokens.fontWeightRegular,
    },
    '& [aria-current="page"] *': {
      fontWeight: tokens.fontWeightRegular,
    },
    '& [aria-current="page"]::after': {
      display: 'none',
    },
    // All NavItems transparent at rest (demo white), not just the
    // selected one: Fluent NavItem's default is #f0f0f0, which read
    // as grey blocks on this white menu, with the selected item
    // standing out as white — the inverse of the demo.
    // This is a class rule on purpose, NOT an inline style on every
    // NavItem: an inline transparent would also beat the hover rule
    // below (inline styles beat classes), making hover invisible.
    // A class base rule lets the higher-specificity :hover rule win.
    '& button, & a': {
      backgroundColor: 'transparent',
    },
    // Light pale-grey hover, never blue or dark. Unselected items only.
    // The selected item keeps its fill-free look via the
    // [aria-current="page"] rule above, and hover is excluded there,
    // so the active item never shows a fill, even on hover.
    '& button:not([aria-current="page"]):hover, & a:not([aria-current="page"]):hover':
      {
        // Theme token: light ~#f5f5f5 (was #f3f2f1), dark a dark
        // grey — never a pale fill under dark-mode light text.
        backgroundColor: tokens.colorNeutralBackground1Hover,
      },
    // Icons follow the theme foreground token (light dark-grey,
    // dark light-grey), not a hardcoded #424242 that vanishes on dark.
    '& svg': {
      color: tokens.colorNeutralForeground2,
    },
  },
  // Demo toggle: the top button of the demo rail. Hamburger icon,
  // transparent, dark #424242 icon, focusable by default (a native
  // Fluent Button, no tabIndex override), with an accessible label
  // that changes with state. It is NOT a NavItem, so it never
  // navigates and never shows a selection bar.
  toggleWrap: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    paddingRight: tokens.spacingHorizontalS,
  },
  toggleButton: {
    minWidth: '40px',
    width: '40px',
    height: '40px',
    padding: '0px',
    color: tokens.colorNeutralForeground2,
  },
  navList: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
  },
  sectionHeader: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalXS} ${tokens.spacingHorizontalL}`,
    color: tokens.colorNeutralForeground3,
  },
  badge: {
    backgroundColor: tokens.colorNeutralBackground3,
    // Fluent 2 checklist mapping (ws6): surfaces use Medium (4px);
    // Large/XLarge are no longer used for badges.
    borderRadius: tokens.borderRadiusMedium,
    padding: `0 ${tokens.spacingHorizontalSNudge}`,
    // Ws6: tokenised to Base200 (12px, +1px) with its line-height
    // (16px, -2px); badge height moves 18px to 16px. No 11px token
    // exists; 12px is chosen over 10px so the badge stays readable.
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: tokens.spacingHorizontalS,
  },
  subItems: {
    display: 'flex',
    flexDirection: 'column',
  },
  // Environment row pinned to the bottom of the nav (below the
  // flex-1 nav list): environment name bottom-left, status
  // bottom-right, matching the reference pattern. Values are demo
  // data (see lib/demo-environment.ts); no backend is consulted.
  environmentRow: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderTop: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForeground2,
  },
  environmentName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  environmentStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    flexShrink: 0,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorPaletteGreenBackground3,
    flexShrink: 0,
  },
})

type NavigationPaneProps = {
  expanded: boolean
  onToggle: () => void
}

export default function NavigationPane({
  expanded,
  onToggle,
}: NavigationPaneProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const openTab = useShellStore((state) => state.openTab)
  const [openParents, setOpenParents] = useState<Record<string, boolean>>({})
  // Nav visibility from the Display settings screen, persisted in
  // localStorage (see lib/nav-visibility.ts). Re-read on the change
  // event (submit on /settings/display) and on storage events
  // (another tab), so the nav updates without a reload. The layout
  // itself is not remounted on route change, so localStorage alone
  // would not re-render this component.
  const [visibility, setVisibility] = useState<NavVisibility>(() =>
    loadNavVisibility()
  )
  useEffect(() => {
    const refresh = () => setVisibility(loadNavVisibility())
    window.addEventListener(NAV_VISIBILITY_CHANGED_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(NAV_VISIBILITY_CHANGED_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  // Filter nav groups by Display visibility: a top-level entry is
  // shown only when its toggle is on (Settings hides the whole
  // parent + sub-items). Groups left empty are hidden entirely,
  // including their section header. Titles with no visibility id
  // (none exist today) stay visible rather than vanishing.
  const visibleGroups = navigationData.navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const id = navVisibilityIdForTitle(item.title)
        return id === null || visibility[id]
      }),
    }))
    .filter((group) => group.items.length > 0)

  const toggleParent = (title: string) =>
    setOpenParents((prev) => ({ ...prev, [title]: !(prev[title] ?? false) }))

  // Navigation and parent expansion use NavItem onClick, NOT Nav
  // onNavItemSelect, on purpose: Fluent Nav's internal onSelect only
  // fires when event.target is an HTMLElement, and clicking an icon
  // gives an SVGElement target, so icon-only (collapsed) items never
  // fired onNavItemSelect in testing, while text clicks did. onClick
  // on the NavItem itself fires for icon, text, mouse and keyboard
  // alike. Selected state still comes from Nav selectedValue, which
  // does not depend on onNavItemSelect.
  const handleParent = (title: string) => {
    if (!expanded) {
      // Collapsed parent icon: expand the menu first, then open
      // that parent, so its sub-items become reachable.
      onToggle()
      setOpenParents((prev) => ({ ...prev, [title]: true }))
    } else {
      toggleParent(title)
    }
  }

  const renderLeaf = (item: NavigationItem, indent: boolean) => {
    const Icon = item.icon
    const label = (
      <span className={styles.labelRow}>
        <span>{item.title}</span>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
      </span>
    )
    // No inline background here on purpose: the menu styles set every
    // NavItem transparent at rest (see the '& button, & a' rule), so
    // an inline transparent would only block the hover rule. The
    // selected item stays fill-free via the [aria-current="page"]
    // rule in the menu styles.
    // Clicking a leaf navigates AND opens (or activates) its
    // document tab in the shell store; selection follows the current
    // route, never a hardcoded url.
    // Group 1 icons: navigation icons are 20px Regular, active and
    // inactive alike. The active item is marked by the 3px brand
    // bar + brand colour (see the menu styles), not by a Filled
    // glyph, so no filled prop is passed here.
    return (
      <NavItem
        key={item.url ?? item.title}
        value={item.url ?? item.title}
        onClick={() => {
          if (item.url) {
            openTab({ id: item.url, title: item.title, url: item.url })
            navigate({ to: item.url })
          }
        }}
        icon={Icon ? <Icon /> : undefined}
        aria-label={
          item.badge ? `${item.title}, ${item.badge} unread` : item.title
        }
        style={
          indent ? { paddingLeft: tokens.spacingHorizontalXXXL } : undefined
        }
      >
        {expanded ? label : null}
      </NavItem>
    )
  }

  const renderParent = (item: NavigationItem) => {
    const Icon = item.icon
    const isOpen = openParents[item.title] ?? false
    const ExpandIcon = isOpen ? ChevronDown20Regular : ChevronRight20Regular
    return (
      <div key={item.title}>
        <NavItem
          value={`parent:${item.title}`}
          onClick={() => handleParent(item.title)}
          icon={Icon ? <Icon /> : undefined}
          aria-label={item.title}
          aria-expanded={expanded ? isOpen : undefined}
        >
          {expanded ? (
            <span className={styles.labelRow}>
              <span>{item.title}</span>
              <ExpandIcon />
            </span>
          ) : null}
        </NavItem>
        {expanded && isOpen && item.items && (
          <div className={styles.subItems}>
            {item.items.map((sub) => renderLeaf(sub, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={styles.menu}
      style={{ width: expanded ? MENU_WIDTH_EXPANDED : MENU_WIDTH_COLLAPSED }}
    >
      <div
        className={styles.toggleWrap}
        style={{ justifyContent: expanded ? 'flex-start' : 'center' }}
      >
        <Tooltip
          content={expanded ? 'Collapse menu' : 'Expand menu'}
          relationship='label'
        >
          <Button
            appearance='transparent'
            className={styles.toggleButton}
            icon={<Navigation20Regular />}
            aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
            title={expanded ? 'Collapse menu' : 'Expand menu'}
            onClick={onToggle}
          />
        </Tooltip>
      </div>
      <Nav
        className={styles.navList}
        aria-label='Main navigation'
        selectedValue={pathname}
      >
        {visibleGroups.map((group) => (
          <div key={group.title}>
            {expanded && (
              <NavSectionHeader className={styles.sectionHeader}>
                <Text size={200} weight='semibold'>
                  {group.title}
                </Text>
              </NavSectionHeader>
            )}
            {group.items.map((item) =>
              item.items ? renderParent(item) : renderLeaf(item, false)
            )}
          </div>
        ))}
      </Nav>
      <div
        className={styles.environmentRow}
        style={{ justifyContent: expanded ? 'space-between' : 'center' }}
        title={`${DEMO_ENVIRONMENT.name} — ${DEMO_ENVIRONMENT.status}`}
      >
        {expanded ? (
          <>
            <Text size={200} className={styles.environmentName}>
              {DEMO_ENVIRONMENT.name}
            </Text>
            <span className={styles.environmentStatus}>
              <span className={styles.statusDot} aria-hidden='true' />
              <Text size={200}>{DEMO_ENVIRONMENT.status}</Text>
            </span>
          </>
        ) : (
          <span className={styles.statusDot} aria-hidden='true' />
        )}
      </div>
    </div>
  )
}
