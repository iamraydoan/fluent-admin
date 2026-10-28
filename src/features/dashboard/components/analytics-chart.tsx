import { tokens } from '@fluentui/react-components'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Mon',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Tue',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Wed',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Thu',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Fri',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Sat',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Sun',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
]

// Chart greys: no Fluent token equals #888888 or #8a8886, so both map
// to the nearest token, colorNeutralForeground4 (#707070) — darker by
// about 24 steps. The two greys were already near-identical, so the
// axis/series relationship is unchanged.
export function AnalyticsChart() {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey='name'
          stroke={tokens.colorNeutralForeground4}
          fontSize={tokens.fontSizeBase200}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={tokens.colorNeutralForeground4}
          fontSize={tokens.fontSizeBase200}
          tickLine={false}
          axisLine={false}
        />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke={tokens.colorBrandBackground}
          fill={tokens.colorBrandBackground}
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke={tokens.colorNeutralForeground4}
          fill={tokens.colorNeutralForeground4}
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
