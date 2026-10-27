// Fluent MessageBar wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change MessageBar styling system-wide.
import {
  MessageBar as FluentMessageBar,
  MessageBarActions as FluentMessageBarActions,
  MessageBarBody as FluentMessageBarBody,
  type MessageBarActionsProps,
  type MessageBarBodyProps,
  type MessageBarProps,
} from '@fluentui/react-components'

export function MessageBar(props: MessageBarProps) {
  return <FluentMessageBar {...props} />
}

export function MessageBarActions(props: MessageBarActionsProps) {
  return <FluentMessageBarActions {...props} />
}

export function MessageBarBody(props: MessageBarBodyProps) {
  return <FluentMessageBarBody {...props} />
}
