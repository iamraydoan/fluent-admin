import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ArrowClockwise20Regular } from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
import { apps } from './data/apps'

const route = getRouteApi('/_authenticated/apps/')

type AppType = 'all' | 'connected' | 'notConnected'

const useStyles = makeStyles({
  content: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    minHeight: 0,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
  },
  filterField: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  filterLabel: {
    color: tokens.colorNeutralForeground3,
  },
  filterInput: {
    width: '200px',
  },
  grid: {
    display: 'grid',
    gap: tokens.spacingHorizontalL,
    gridTemplateColumns: 'repeat(3, 1fr)',
    listStyleType: 'none',
    margin: '0',
    padding: '0',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  appCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXXL,
    borderRadius: tokens.borderRadiusXLarge,
  },
  appTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
  },
  appDesc: {
    color: tokens.colorNeutralForeground3,
  },
})

export function Apps() {
  const styles = useStyles()
  const {
    filter = '',
    type = 'all',
    sort: initSort = 'asc',
  } = route.useSearch()
  const navigate = route.useNavigate()

  const [sort, setSort] = useState(initSort)
  const [appType, setAppType] = useState(type)
  const [searchTerm, setSearchTerm] = useState(filter)
  // Local-only connection state, seeded from the static demo data:
  // Connect/Connected is a real toggle in this screen's state (with a
  // "(local only)" toast), not a dead button — but nothing is sent to
  // any app or API, and Refresh (filters only) leaves it untouched.
  const [connectedNames, setConnectedNames] = useState<ReadonlySet<string>>(
    () => new Set(apps.filter((app) => app.connected).map((app) => app.name))
  )
  const isConnected = (name: string) => connectedNames.has(name)

  const handleToggleConnection = (name: string) => {
    if (isConnected(name)) {
      setConnectedNames((prev) => {
        const next = new Set(prev)
        next.delete(name)
        return next
      })
      toast.info(`${name} disconnected (local only)`)
    } else {
      setConnectedNames((prev) => new Set(prev).add(name))
      toast.success(`${name} connected (local only)`)
    }
  }

  // Copy before sorting: Array.sort mutates in place, and sorting the
  // shared `apps` module array would reorder it for every later render
  // and every other consumer of that module.
  const filteredApps = [...apps]
    .sort((a, b) =>
      sort === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      appType === 'connected'
        ? isConnected(app.name)
        : appType === 'notConnected'
          ? !isConnected(app.name)
          : true
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    navigate({
      search: (prev) => ({
        ...prev,
        filter: value || undefined,
      }),
    })
  }

  const handleTypeChange = (value: AppType) => {
    setAppType(value)
    navigate({
      search: (prev) => ({
        ...prev,
        type: value === 'all' ? undefined : value,
      }),
    })
  }

  const handleSortChange = (value: 'asc' | 'desc') => {
    setSort(value)
    navigate({ search: (prev) => ({ ...prev, sort: value }) })
  }

  const handleRefresh = () => {
    setSearchTerm('')
    setAppType('all')
    setSort('asc')
    navigate({
      search: (prev) => ({
        ...prev,
        filter: undefined,
        type: undefined,
        sort: undefined,
      }),
    })
  }

  return (
    <>
      <PageTop
        title='Apps'
        actionBar={
          <ActionBar
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise20Regular />,
                    onClick: handleRefresh,
                  },
                ],
              },
            ]}
          />
        }
      />
      <div className={styles.content}>
        <Card
          style={{
            borderRadius: tokens.borderRadiusXLarge,
            boxShadow: tokens.shadow2,
          }}
        >
          <div className={styles.cardBody}>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <Input
                  placeholder='Filter apps...'
                  className={styles.filterInput}
                  value={searchTerm}
                  onChange={(_, data) => handleSearch(data.value)}
                />
                <div className={styles.filterField}>
                  <Text size={200} className={styles.filterLabel}>
                    TYPE:
                  </Text>
                  <Select
                    aria-label='Filter apps by connection type'
                    value={appType}
                    onChange={(_, data) =>
                      handleTypeChange(data.value as AppType)
                    }
                  >
                    <option value='all'>All Apps</option>
                    <option value='connected'>Connected</option>
                    <option value='notConnected'>Not Connected</option>
                  </Select>
                </div>
              </div>

              <div className={styles.filterField}>
                <Text size={200} className={styles.filterLabel}>
                  SORT:
                </Text>
                <Select
                  aria-label='Sort apps by name'
                  value={sort}
                  onChange={(_, data) =>
                    handleSortChange(data.value as 'asc' | 'desc')
                  }
                >
                  <option value='asc'>Ascending</option>
                  <option value='desc'>Descending</option>
                </Select>
              </div>
            </div>
            <Separator />
            <ul className={styles.grid}>
              {filteredApps.map((app) => (
                <li key={app.name}>
                  <Card className={styles.appCard}>
                    <div className={styles.appTop}>
                      <div className={styles.logo}>{app.logo}</div>
                      <Button
                        appearance={
                          isConnected(app.name) ? 'secondary' : 'primary'
                        }
                        size='small'
                        onClick={() => handleToggleConnection(app.name)}
                      >
                        {isConnected(app.name) ? 'Connected' : 'Connect'}
                      </Button>
                    </div>
                    <div>
                      <Text weight='semibold' block>
                        {app.name}
                      </Text>
                      <Text size={200} className={styles.appDesc}>
                        {app.desc}
                      </Text>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </>
  )
}
