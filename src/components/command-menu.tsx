import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { ChevronRight20Regular, Dismiss20Regular } from '@fluentui/react-icons'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'
import { navigationData } from './layout/data/navigation-data'

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: '0',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: tokens.colorBackgroundOverlay,
    paddingTop: '96px',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
  },
  surface: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    width: '100%',
    maxWidth: '560px',
    maxHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
  },
  list: {
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  groupTitle: {
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    color: tokens.colorNeutralForeground3,
  },
  item: {
    justifyContent: 'flex-start',
  },
  activeItem: {
    backgroundColor: tokens.colorSubtleBackgroundHover,
  },
})

type CommandEntry = {
  group: string
  label: string
  run: () => void
}

export function CommandMenu() {
  const styles = useStyles()
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const [query, setQuery] = React.useState('')
  // Keyboard navigation: activeIndex is the flat index into the
  // filtered list (-1 = nothing active, focus stays on the input).
  // ArrowDown moves focus OFF the input onto a command item (the
  // first item, or the next one); ArrowUp moves back up the list
  // and onto the input from the first item; Enter runs the active
  // item (from the input, or natively via the focused button's
  // click). Item buttons are found through the list container
  // (the only buttons inside it are the command items, in order),
  // so no ref forwarding through the Button wrapper is needed.
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const headerRef = React.useRef<HTMLDivElement | null>(null)

  const focusItem = React.useCallback((index: number) => {
    const buttons = listRef.current?.querySelectorAll('button')
    const target = buttons?.[index]
    if (target) {
      target.focus()
      setActiveIndex(index)
    }
  }, [])

  // Focus the search input through the header container (the Input
  // wrapper does not forward a ref, so no ref is passed to it).
  const focusInput = React.useCallback(() => {
    headerRef.current?.querySelector('input')?.focus()
    setActiveIndex(-1)
  }, [])

  // Closing by any means (Escape, overlay, close button, Ctrl/Cmd+K
  // toggle in the provider) clears the query and active index, so a
  // reopened menu never resumes a stale filtered list. This is the
  // render-time state adjustment for a changed prop (not an effect):
  // React re-renders immediately before committing, so no cascading
  // committed render occurs, and the provider's toggle path — which
  // bypasses this component's close handlers — is covered too.
  const [prevOpen, setPrevOpen] = React.useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (!open) {
      setQuery('')
      setActiveIndex(-1)
    }
  }

  const closeMenu = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  // Active index resets whenever the query changes (the filtered
  // list is rebuilt, so a stale index would point at the wrong
  // item). Done in the change handler, not an effect, so no
  // setState-in-effect lint error.
  const handleQueryChange = React.useCallback((value: string) => {
    setQuery(value)
    setActiveIndex(-1)
  }, [])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      setQuery('')
      setActiveIndex(-1)
      command()
    },
    [setOpen]
  )

  const entries = React.useMemo<CommandEntry[]>(() => {
    const list: CommandEntry[] = []
    for (const group of navigationData.navGroups) {
      for (const navItem of group.items) {
        if (navItem.url) {
          list.push({
            group: group.title,
            label: navItem.title,
            run: () => navigate({ to: navItem.url }),
          })
        } else {
          for (const subItem of navItem.items ?? []) {
            list.push({
              group: group.title,
              label: `${navItem.title} › ${subItem.title}`,
              run: () => navigate({ to: subItem.url }),
            })
          }
        }
      }
    }
    list.push(
      { group: 'Theme', label: 'Light', run: () => setTheme('light') },
      { group: 'Theme', label: 'Dark', run: () => setTheme('dark') },
      { group: 'Theme', label: 'System', run: () => setTheme('system') }
    )
    return list
  }, [navigate, setTheme])

  if (!open) {
    return null
  }

  const q = query.trim().toLowerCase()
  const filtered = q
    ? entries.filter(
        (entry) =>
          entry.label.toLowerCase().includes(q) ||
          entry.group.toLowerCase().includes(q)
      )
    : entries
  const groups = Array.from(new Set(filtered.map((entry) => entry.group)))
  // Flat index per filtered entry, so group rendering can map a
  // button back to its position in the keyboard-navigable list.
  const indexed = filtered.map((entry, index) => ({ entry, index }))

  return (
    <div className={styles.overlay} onClick={() => closeMenu()}>
      <div
        role='dialog'
        aria-label='Search'
        className={styles.surface}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header} ref={headerRef}>
          <Input
            autoFocus
            placeholder='Type a command or search...'
            value={query}
            onChange={(_, data) => handleQueryChange(data.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                closeMenu()
                return
              }
              if (event.key === 'ArrowDown' && filtered.length > 0) {
                event.preventDefault()
                focusItem(
                  activeIndex < 0
                    ? 0
                    : Math.min(activeIndex + 1, filtered.length - 1)
                )
                return
              }
              if (event.key === 'ArrowUp' && activeIndex > 0) {
                event.preventDefault()
                focusItem(activeIndex - 1)
                return
              }
              if (event.key === 'Enter' && activeIndex >= 0) {
                event.preventDefault()
                const active = filtered[activeIndex]
                if (active) runCommand(active.run)
              }
            }}
            // Borderless inside the dialog header (the header already
            // carries the bottom divider); the style lands on the
            // Fluent Input root, native props above land on the
            // inner input element.
            style={{
              flex: '1',
              minWidth: '0',
              border: 'none',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          />
          <Tooltip content='Close search' relationship='label'>
            <Button
              appearance='subtle'
              shape='circular'
              aria-label='Close search'
              icon={<Dismiss20Regular />}
              onClick={() => closeMenu()}
            />
          </Tooltip>
        </div>
        <div className={styles.list} ref={listRef}>
          {filtered.length === 0 && <Text>No results found.</Text>}
          {groups.map((group) => (
            <div key={group} className={styles.group}>
              <Text size={200} weight='semibold' className={styles.groupTitle}>
                {group}
              </Text>
              {indexed
                .filter(({ entry }) => entry.group === group)
                .map(({ entry, index }) => (
                  <Button
                    key={`${group}-${entry.label}`}
                    appearance='subtle'
                    className={mergeClasses(
                      styles.item,
                      index === activeIndex && styles.activeItem
                    )}
                    icon={<ChevronRight20Regular />}
                    onClick={() => runCommand(entry.run)}
                    onFocus={() => setActiveIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') {
                        closeMenu()
                        return
                      }
                      if (
                        event.key === 'ArrowDown' &&
                        index < filtered.length - 1
                      ) {
                        event.preventDefault()
                        focusItem(index + 1)
                        return
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault()
                        if (index > 0) focusItem(index - 1)
                        // First item + ArrowUp: back onto the input.
                        else focusInput()
                      }
                      // Enter/Space on a focused item fire the
                      // button's onClick natively and run it.
                    }}
                  >
                    {entry.label}
                  </Button>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
