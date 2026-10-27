// Fluent Divider wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Divider styling system-wide.
import {
  Divider as FluentDivider,
  type DividerProps,
} from '@fluentui/react-components'

export function Divider(props: DividerProps) {
  return <FluentDivider {...props} />
}
