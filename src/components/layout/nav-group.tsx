import { useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import {
  ChevronDown20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons'
import { Badge } from '@/components/ui/badge'
import { Nav, NavItem, NavSectionHeader } from '@/components/ui/nav'
import { Text } from '@/components/ui/text'
import {
  type NavCollapsible,
  type NavItem as NavItemData,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'

const useStyles = makeStyles({
  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    padding: '16px 16px 4px 16px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '8px',
  },
  labelText: {
    flexGrow: 1,
    textAlign: 'left',
  },
  subItems: {
    display: 'flex',
    flexDirection: 'column',
  },
})

type NavGroupViewProps = NavGroupProps & {
  collapsed: boolean
  // Called when a collapsed parent icon is clicked: the sidebar
  // expands, and the parent can then be opened with a second click.
  // (Expanding AND opening in one click would need state synced
  // between sidebar and group; the two-click behaviour is kept
  // deliberately simple.)
  onRequestExpand: () => void
}

export function NavGroup({
  title,
  items,
  collapsed,
  onRequestExpand,
}: NavGroupViewProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const href = useLocation({ select: (location) => location.href })
  const [openParents, setOpenParents] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      for (const item of items) {
        if (item.items && checkIsActive(href, item, true)) {
          initial[item.title] = true
        }
      }
      return initial
    }
  )

  const activeUrl = findActiveUrl(href, items)

  const go = (url: string) => {
    navigate({ to: url })
  }

  const renderLeaf = (item: NavLink, indent: boolean) => {
    const Icon = item.icon
    // NavLink.url is typed via TanStack LinkProps['to'], which
    // includes undefined; every leaf in sidebar-data has a url, and
    // the fallbacks below only satisfy the type checker.
    const url = item.url ?? item.title
    return (
      <NavItem
        key={`${item.title}-${item.url}`}
        value={url}
        onClick={() => go(url)}
        icon={Icon ? <Icon /> : undefined}
        aria-label={
          item.badge ? `${item.title}, ${item.badge} unread` : item.title
        }
        style={indent ? { paddingLeft: '32px' } : undefined}
      >
        {collapsed ? null : (
          <span className={styles.labelRow}>
            <span className={styles.labelText}>{item.title}</span>
            {item.badge && <Badge>{item.badge}</Badge>}
          </span>
        )}
      </NavItem>
    )
  }

  const renderParent = (item: NavCollapsible) => {
    const isOpen = openParents[item.title] ?? false
    const ExpandIcon = isOpen ? ChevronDown20Regular : ChevronRight20Regular
    const Icon = item.icon
    return (
      <div key={item.title} className={styles.group}>
        <NavItem
          value={`parent:${item.title}`}
          onClick={() => {
            if (collapsed) {
              onRequestExpand()
            } else {
              setOpenParents((prev) => ({ ...prev, [item.title]: !isOpen }))
            }
          }}
          icon={Icon ? <Icon /> : undefined}
          aria-label={item.title}
          aria-expanded={collapsed ? undefined : isOpen}
        >
          {collapsed ? null : (
            <span className={styles.labelRow}>
              <span className={styles.labelText}>{item.title}</span>
              <ExpandIcon />
            </span>
          )}
        </NavItem>
        {!collapsed && isOpen && (
          <div className={styles.subItems}>
            {item.items.map((sub) => renderLeaf(sub, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.group}>
      <Nav aria-label={title} selectedValue={activeUrl ?? ''}>
        {!collapsed && (
          <NavSectionHeader className={styles.sectionHeader}>
            <Text size={200} weight='semibold'>
              {title}
            </Text>
          </NavSectionHeader>
        )}
        {items.map((item) =>
          item.items ? renderParent(item) : renderLeaf(item, false)
        )}
      </Nav>
    </div>
  )
}

function findActiveUrl(href: string, items: NavItemData[]): string | undefined {
  const path = href.split('?')[0]
  for (const item of items) {
    if (!item.items && (href === item.url || path === item.url)) {
      return item.url
    }
    if (item.items) {
      for (const sub of item.items) {
        if (href === sub.url || path === sub.url) {
          return sub.url
        }
      }
    }
  }
  return undefined
}

function checkIsActive(href: string, item: NavItemData, mainNav = false) {
  return (
    href === item.url ||
    href.split('?')[0] === item.url ||
    !!item?.items?.filter((i) => i.url === href).length ||
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
