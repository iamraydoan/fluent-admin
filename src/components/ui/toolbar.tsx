// Fluent Toolbar wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Toolbar styling system-wide.
import {
  Toolbar as FluentToolbar,
  ToolbarButton as FluentToolbarButton,
  ToolbarDivider as FluentToolbarDivider,
  ToolbarGroup as FluentToolbarGroup,
  type ToolbarButtonProps,
  type ToolbarDividerProps,
  type ToolbarGroupProps,
  type ToolbarProps,
} from '@fluentui/react-components'

export function Toolbar(props: ToolbarProps) {
  return <FluentToolbar {...props} />
}

export function ToolbarButton(props: ToolbarButtonProps) {
  return <FluentToolbarButton {...props} />
}

export function ToolbarDivider(props: ToolbarDividerProps) {
  return <FluentToolbarDivider {...props} />
}

export function ToolbarGroup(props: ToolbarGroupProps) {
  return <FluentToolbarGroup {...props} />
}
