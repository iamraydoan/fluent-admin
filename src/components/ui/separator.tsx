// Separator wrapper, kept under its original name.
// There is no Fluent Separator component: Fluent Divider is the
// equivalent, so this wrapper renders Divider under the old name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Separator styling system-wide.
import {
  Divider as FluentDivider,
  type DividerProps,
} from '@fluentui/react-components'

export function Separator(props: DividerProps) {
  return <FluentDivider {...props} />
}
