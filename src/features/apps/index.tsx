import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ArrowClockwise24Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import HeaderBlock from '@/features/mes-agent/components/HeaderBlock'
import Ribbon from '@/features/mes-agent/components/Ribbon'
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
    gap: '16px',
    padding: '16px',
    minHeight: 0,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterInput: {
    width: '200px',
  },
  grid: {
    display: 'grid',
    gap: '16px',
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
    gap: '32px',
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
    padding: '8px',
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

  const filteredApps = apps
    .sort((a, b) =>
      sort === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      appType === 'connected'
        ? app.connected
        : appType === 'notConnected'
          ? !app.connected
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
      <HeaderBlock
        title='Apps'
        ribbon={
          <Ribbon
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise24Regular />,
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
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
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
                <Select
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

              <Select
                value={sort}
                onChange={(_, data) =>
                  handleSortChange(data.value as 'asc' | 'desc')
                }
              >
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </Select>
            </div>
            <Separator />
            <ul className={styles.grid}>
              {filteredApps.map((app) => (
                <li key={app.name}>
                  <Card className={styles.appCard}>
                    <div className={styles.appTop}>
                      <div className={styles.logo}>{app.logo}</div>
                      <Button
                        appearance={app.connected ? 'primary' : 'outline'}
                        size='small'
                      >
                        {app.connected ? 'Connected' : 'Connect'}
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
