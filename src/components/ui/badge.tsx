// Fluent Badge wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Badge styling system-wide.
import {
  Badge as FluentBadge,
  type BadgeProps,
} from '@fluentui/react-components'

export function Badge(props: BadgeProps) {
  return <FluentBadge {...props} />
}
