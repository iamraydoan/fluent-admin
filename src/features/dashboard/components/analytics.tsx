import { makeStyles, tokens } from '@fluentui/react-components'
import { Card, CardHeader } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { AnalyticsChart } from './analytics-chart'

const useStyles = makeStyles({
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  splitGrid: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '4fr 3fr',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    listStyleType: 'none',
    margin: '0',
    padding: '0',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  barTrack: {
    height: '10px',
    width: '100%',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralBackground3,
    overflow: 'hidden',
  },
  barFillPrimary: {
    height: '10px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground,
  },
  barFillMuted: {
    height: '10px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralForeground3,
  },
  barLabel: {
    color: tokens.colorNeutralForeground3,
    marginBottom: '4px',
  },
})

const stats = [
  { label: 'Total Clicks', value: '1,248', delta: '+12.4% vs last week' },
  { label: 'Unique Visitors', value: '832', delta: '+5.8% vs last week' },
  { label: 'Bounce Rate', value: '42%', delta: '-3.2% vs last week' },
  { label: 'Avg. Session', value: '3m 24s', delta: '+18s vs last week' },
]

export function Analytics() {
  const styles = useStyles()

  return (
    <div className={styles.stack}>
      <Card>
        <CardHeader
          header={<Text weight='semibold'>Traffic Overview</Text>}
          description={
            <Text size={200}>Weekly clicks and unique visitors</Text>
          }
        />
        <AnalyticsChart />
      </Card>
      <div className={styles.statGrid}>
        {stats.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <CardHeader header={<Text weight='semibold'>{stat.label}</Text>} />
            <Text className={styles.statValue}>{stat.value}</Text>
            <Text size={200} className={styles.statDelta}>
              {stat.delta}
            </Text>
          </Card>
        ))}
      </div>
      <div className={styles.splitGrid}>
        <Card>
          <CardHeader
            header={<Text weight='semibold'>Referrers</Text>}
            description={<Text size={200}>Top sources driving traffic</Text>}
          />
          <SimpleBarList
            items={[
              { name: 'Direct', value: 512 },
              { name: 'Product Hunt', value: 238 },
              { name: 'Twitter', value: 174 },
              { name: 'Blog', value: 104 },
            ]}
            muted={false}
            valueFormatter={(n) => `${n}`}
          />
        </Card>
        <Card>
          <CardHeader
            header={<Text weight='semibold'>Devices</Text>}
            description={<Text size={200}>How users access your app</Text>}
          />
          <SimpleBarList
            items={[
              { name: 'Desktop', value: 74 },
              { name: 'Mobile', value: 22 },
              { name: 'Tablet', value: 4 },
            ]}
            muted
            valueFormatter={(n) => `${n}%`}
          />
        </Card>
      </div>
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  muted,
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  muted: boolean
}) {
  const styles = useStyles()
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className={styles.list}>
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name}>
            <div className={styles.barLabel}>
              <Text size={200}>{i.name}</Text>
            </div>
            <div className={styles.barRow}>
              <div className={styles.barTrack}>
                <div
                  className={
                    muted ? styles.barFillMuted : styles.barFillPrimary
                  }
                  style={{ width }}
                />
              </div>
              <Text size={200} weight='semibold'>
                {valueFormatter(i.value)}
              </Text>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
