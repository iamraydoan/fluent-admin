import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ArrowClockwise24Regular } from '@fluentui/react-icons'
import { Card, CardHeader } from '@/components/ui/card'
import { Tab, TabList } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import HeaderBlock from '@/components/layout/header-block'
import Ribbon from '@/components/layout/ribbon'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

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
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  statGrid: {
    display: 'grid',
    gap: tokens.spacingHorizontalL,
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
    gap: tokens.spacingVerticalXS,
  },
  statValue: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    fontVariantNumeric: 'tabular-nums',
  },
  statDelta: {
    color: tokens.colorNeutralForeground3,
  },
  mainGrid: {
    display: 'grid',
    gap: tokens.spacingHorizontalL,
    gridTemplateColumns: '4fr 3fr',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  chartCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
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
  // Bumped on ribbon Refresh so the tab content remounts and the tab
  // resets to Overview. The old heading-row Download button had no
  // onClick handler, so it is dropped rather than carried into the
  // ribbon as a dead action (see report).
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <HeaderBlock
        title='Dashboard'
        ribbon={
          <Ribbon
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise24Regular />,
                    onClick: () => {
                      setTab('overview')
                      setRefreshKey((key) => key + 1)
                    },
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
          <div className={styles.cardBody} key={refreshKey}>
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
                    <CardHeader
                      header={<Text weight='semibold'>Overview</Text>}
                    />
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
          </div>
        </Card>
      </div>
    </>
  )
}
