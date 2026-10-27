import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Tab, TabList } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

const useStyles = makeStyles({
  headingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '16px',
  },
  statGrid: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(4, 1fr)',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
  },
  statDelta: {
    color: tokens.colorNeutralForeground3,
  },
  mainGrid: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '4fr 3fr',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  chartCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
})

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    delta: '+20.1% from last month',
  },
  { label: 'Subscriptions', value: '+2350', delta: '+180.1% from last month' },
  { label: 'Sales', value: '+12,234', delta: '+19% from last month' },
  { label: 'Active Now', value: '+573', delta: '+201 since last hour' },
]

export function Dashboard() {
  const styles = useStyles()
  const [tab, setTab] = useState('overview')

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className={styles.headingRow}>
          <Text size={600} weight='bold'>
            Dashboard
          </Text>
          <Button>Download</Button>
        </div>
        <TabList
          selectedValue={tab}
          onTabSelect={(_, data) => setTab(String(data.value))}
        >
          <Tab value='overview'>Overview</Tab>
          <Tab value='analytics'>Analytics</Tab>
          <Tab value='reports' disabled>
            Reports
          </Tab>
          <Tab value='notifications' disabled>
            Notifications
          </Tab>
        </TabList>
        {tab === 'overview' && (
          <div className={styles.tabContent}>
            <div className={styles.statGrid}>
              {stats.map((stat) => (
                <Card key={stat.label} className={styles.statCard}>
                  <CardHeader
                    header={<Text weight='semibold'>{stat.label}</Text>}
                  />
                  <Text className={styles.statValue}>{stat.value}</Text>
                  <Text size={200} className={styles.statDelta}>
                    {stat.delta}
                  </Text>
                </Card>
              ))}
            </div>
            <div className={styles.mainGrid}>
              <Card className={styles.chartCard}>
                <CardHeader header={<Text weight='semibold'>Overview</Text>} />
                <Overview />
              </Card>
              <Card className={styles.chartCard}>
                <CardHeader
                  header={<Text weight='semibold'>Recent Sales</Text>}
                  description={
                    <Text size={200}>You made 265 sales this month.</Text>
                  }
                />
                <RecentSales />
              </Card>
            </div>
          </div>
        )}
        {tab === 'analytics' && (
          <div className={styles.tabContent}>
            <Analytics />
          </div>
        )}
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
