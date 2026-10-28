import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ArrowClockwise24Regular } from '@fluentui/react-icons'
import { formatCurrency, formatNumber } from '@/lib/format'
import { Card, CardHeader } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
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
    // Absolute value: no '+' sign; the delta line below carries the change.
    value: formatCurrency(45231.89),
    delta: '+20.1% from last month',
  },
  {
    label: 'Subscriptions',
    value: formatNumber(2350),
    delta: '+180.1% from last month',
  },
  { label: 'Sales', value: formatNumber(12234), delta: '+19% from last month' },
  {
    label: 'Active Now',
    value: formatNumber(573),
    delta: '+201 since last hour',
  },
]

// Page tabs, in the top ribbon above the Action Bar (the screen-layout
// standard): one tab per Dashboard view. The old in-content TabList and
// its disabled Reports/Notifications tabs are gone.
const DASHBOARD_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'analytics', label: 'Analytics' },
]

export function Dashboard() {
  const styles = useStyles()
  const [tab, setTab] = useState('overview')
  // Bumped on action bar Refresh so the tab content remounts and the tab
  // resets to Overview. The old heading-row Download button had no
  // onClick handler, so it is dropped rather than carried into the
  // action bar as a dead action (see report).
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <PageTop
        title='Dashboard'
        objectTabs={DASHBOARD_TABS}
        objectTab={tab}
        onObjectTabChange={(value) => setTab(value)}
        actionBar={
          <ActionBar
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
            borderRadius: tokens.borderRadiusMedium,
            boxShadow: tokens.shadow2,
            // Fill the remaining page height like the Users/Tasks main
            // cards do: grow to fill when the content is short (so no
            // canvas-grey band is left below the card), but never
            // shrink below the content height when it is tall, so the
            // content column still scrolls instead of clipping.
            flex: '1 0 auto',
          }}
        >
          <div className={styles.cardBody} key={refreshKey}>
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
