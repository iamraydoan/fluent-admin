import { tokens } from '@fluentui/react-components'
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Frozen demo data (2026-10-28): the old Math.random() values changed
// on every load, so Refresh and re-renders redrew the chart. These
// fixed constants keep the demo stable; they are demo data, not a
// live data source.
const data = [
  { name: 'Mon', clicks: 720, uniques: 480 },
  { name: 'Tue', clicks: 840, uniques: 520 },
  { name: 'Wed', clicks: 690, uniques: 610 },
  { name: 'Thu', clicks: 910, uniques: 580 },
  { name: 'Fri', clicks: 1020, uniques: 700 },
  { name: 'Sat', clicks: 540, uniques: 380 },
  { name: 'Sun', clicks: 430, uniques: 290 },
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
        <Tooltip
          contentStyle={{
            backgroundColor: tokens.colorNeutralBackground1,
            border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
            borderRadius: tokens.borderRadiusMedium,
            fontSize: tokens.fontSizeBase200,
          }}
        />
        <Legend wrapperStyle={{ fontSize: tokens.fontSizeBase200 }} />
        <Area
          type='monotone'
          dataKey='clicks'
          name='Clicks'
          stroke={tokens.colorBrandBackground}
          fill={tokens.colorBrandBackground}
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          name='Unique visitors'
          stroke={tokens.colorNeutralForeground4}
          fill={tokens.colorNeutralForeground4}
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
