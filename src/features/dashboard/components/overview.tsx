import { tokens } from '@fluentui/react-components'
import {
  Bar,
  BarChart,
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
  { name: 'Jan', total: 4200 },
  { name: 'Feb', total: 3100 },
  { name: 'Mar', total: 4800 },
  { name: 'Apr', total: 3900 },
  { name: 'May', total: 5200 },
  { name: 'Jun', total: 4600 },
  { name: 'Jul', total: 5800 },
  { name: 'Aug', total: 5100 },
  { name: 'Sep', total: 4300 },
  { name: 'Oct', total: 5600 },
  { name: 'Nov', total: 6100 },
  { name: 'Dec', total: 5900 },
]

// Chart axis grey: no Fluent token equals #888888, so it maps to the
// nearest token, colorNeutralForeground4 (#707070), darker by 24 steps.
export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: tokens.colorNeutralBackground3 }}
          contentStyle={{
            backgroundColor: tokens.colorNeutralBackground1,
            border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
            borderRadius: tokens.borderRadiusMedium,
            fontSize: tokens.fontSizeBase200,
          }}
        />
        <Legend wrapperStyle={{ fontSize: tokens.fontSizeBase200 }} />
        {/* Bar top radius 4 equals borderRadiusMedium, but recharts takes
            numbers, not token strings, so the numeric radius is kept. */}
        <Bar
          dataKey='total'
          name='Total'
          fill={tokens.colorBrandBackground}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
