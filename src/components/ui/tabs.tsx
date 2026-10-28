// Fluent Tab wrappers, kept under their original names.
// Edit this file to change Tab styling system-wide.
//
// One behaviour change from stock Fluent: TabList defaults
// reserveSelectedTabSpace to false. Stock Fluent renders every
// unselected tab's label twice — once visible, once in a
// reserved-space span that holds the selected (semibold) width —
// and that duplicate span is not hidden from assistive tech, so
// an unselected tab's accessible name reads doubled
// ("AnalyticsAnalytics"). Disabling the reservation removes the
// duplicate span entirely, so each tab's accessible name is its
// label exactly once. Cost: tab widths shift by a few px when
// selection changes (selected text is semibold); the row is
// left-aligned and the object-tab rows have only two tabs, so
// nothing after the selected tab is displaced. Callers can still
// opt back in by passing reserveSelectedTabSpace explicitly.
import {
  Tab as FluentTab,
  TabList as FluentTabList,
  type TabListProps,
  type TabProps,
} from '@fluentui/react-components'

export function Tab(props: TabProps) {
  return <FluentTab {...props} />
}

export function TabList({
  reserveSelectedTabSpace = false,
  ...rest
}: TabListProps) {
  return (
    <FluentTabList
      reserveSelectedTabSpace={reserveSelectedTabSpace}
      {...rest}
    />
  )
}
