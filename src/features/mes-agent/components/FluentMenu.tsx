import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Button,
  Nav,
  NavItem,
  NavSectionHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  ChevronDown20Regular,
  ChevronRight20Regular,
  Navigation24Regular,
} from '@fluentui/react-icons'
import { MENU_GROUPS, type FluentMenuItem } from '../menu-data'

// Fluent Nav menu for the MES page, in demo style. This replaces the
// shadcn AppSidebar on this page only: no shadcn, Radix, lucide or
// Tailwind classes are used here, and there is no team/user footer
// (account lives in the header avatar only, see DocumentTabBar).
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
    backgroundColor: '#ffffff',
    borderRight: '1px solid #edebe9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    // 8px left inset, as in the demo rail and Details View: the active
    // bar sits 8px from the menu edge, not flush to it, while the
    // bar-to-icon/text gap stays ~13px.
    paddingLeft: '8px',
    // Single selected-item bar, demo technique: 3px x 20px brand blue,
    // centred, no fill. Fluent Nav's own ::after is hidden, otherwise
    // the selected item shows two bars.
    '& [aria-current="page"]': {
      backgroundImage: 'linear-gradient(#0f6cbd, #0f6cbd)',
      backgroundSize: '3px 20px',
      backgroundPosition: 'left center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'transparent',
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
        backgroundColor: '#f3f2f1',
      },
    // Icons are dark #424242, as in the demo rail, not brand blue.
    '& svg': {
      color: '#424242',
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
    paddingRight: '8px',
  },
  toggleButton: {
    minWidth: '40px',
    width: '40px',
    height: '40px',
    padding: '0px',
    color: '#424242',
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
    padding: '16px 16px 4px 16px',
    color: tokens.colorNeutralForeground3,
  },
  badge: {
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    padding: '0px 6px',
    fontSize: '11px',
    lineHeight: '18px',
    color: '#424242',
    flexShrink: 0,
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '8px',
  },
  subItems: {
    display: 'flex',
    flexDirection: 'column',
  },
})

type FluentMenuProps = {
  expanded: boolean
  onToggle: () => void
}

export default function FluentMenu({ expanded, onToggle }: FluentMenuProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [openParents, setOpenParents] = useState<Record<string, boolean>>({})

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

  const renderLeaf = (item: FluentMenuItem, indent: boolean) => {
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
    // selected item (CM MES Agent on this page) stays fill-free via
    // the [aria-current="page"] rule in the menu styles.
    return (
      <NavItem
        key={item.url ?? item.title}
        value={item.url ?? item.title}
        onClick={() => {
          if (item.url) navigate({ to: item.url })
        }}
        icon={Icon ? <Icon /> : undefined}
        aria-label={
          item.badge ? `${item.title}, ${item.badge} unread` : item.title
        }
        style={indent ? { paddingLeft: '32px' } : undefined}
      >
        {expanded ? label : null}
      </NavItem>
    )
  }

  const renderParent = (item: FluentMenuItem) => {
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
        <Button
          appearance='transparent'
          className={styles.toggleButton}
          icon={<Navigation24Regular />}
          aria-label={expanded ? 'Collapse menu' : 'Expand menu'}
          title={expanded ? 'Collapse menu' : 'Expand menu'}
          onClick={onToggle}
        />
      </div>
      <Nav
        className={styles.navList}
        aria-label='Main navigation'
        selectedValue='/mes-agent'
      >
        {MENU_GROUPS.map((group) => (
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
    </div>
  )
}
