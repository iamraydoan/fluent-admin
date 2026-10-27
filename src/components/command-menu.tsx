import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingTop: '96px',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
  },
  surface: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
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
    gap: '2px',
  },
  groupTitle: {
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    color: tokens.colorNeutralForeground3,
  },
  item: {
    justifyContent: 'flex-start',
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

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      setQuery('')
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

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div
        role='dialog'
        aria-label='Search'
        className={styles.surface}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <Input
            autoFocus
            placeholder='Type a command or search...'
            value={query}
            onChange={(_, data) => setQuery(data.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setOpen(false)
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
              onClick={() => setOpen(false)}
            />
          </Tooltip>
        </div>
        <div className={styles.list}>
          {filtered.length === 0 && <Text>No results found.</Text>}
          {groups.map((group) => (
            <div key={group} className={styles.group}>
              <Text size={200} weight='semibold' className={styles.groupTitle}>
                {group}
              </Text>
              {filtered
                .filter((entry) => entry.group === group)
                .map((entry) => (
                  <Button
                    key={`${group}-${entry.label}`}
                    appearance='subtle'
                    className={styles.item}
                    icon={<ChevronRight20Regular />}
                    onClick={() => runCommand(entry.run)}
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
