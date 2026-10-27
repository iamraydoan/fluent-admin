// Fluent Tooltip wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Tooltip styling system-wide.
import {
  Tooltip as FluentTooltip,
  type TooltipProps,
} from '@fluentui/react-components'

export function Tooltip(props: TooltipProps) {
  return <FluentTooltip {...props} />
}
