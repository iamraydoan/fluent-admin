// Fluent Tab wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Tab styling system-wide.
import {
  Tab as FluentTab,
  TabList as FluentTabList,
  type TabListProps,
  type TabProps,
} from '@fluentui/react-components'

export function Tab(props: TabProps) {
  return <FluentTab {...props} />
}

export function TabList(props: TabListProps) {
  return <FluentTabList {...props} />
}
