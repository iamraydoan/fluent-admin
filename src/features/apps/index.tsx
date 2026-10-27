import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { apps } from './data/apps'

const route = getRouteApi('/_authenticated/apps/')

type AppType = 'all' | 'connected' | 'notConnected'

const useStyles = makeStyles({
  heading: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '16px',
    marginBottom: '16px',
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
    padding: '16px 0 64px',
    overflow: 'auto',
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

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div className={styles.heading}>
          <Text size={600} weight='bold'>
            App Integrations
          </Text>
          <Text className={styles.subtitle}>
            Here&apos;s a list of your apps for the integration!
          </Text>
        </div>
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
              onChange={(_, data) => handleTypeChange(data.value as AppType)}
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
                  <Text weight='semibold'>{app.name}</Text>
                  <Text size={200} className={styles.appDesc}>
                    {app.desc}
                  </Text>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Main>
    </>
  )
}
