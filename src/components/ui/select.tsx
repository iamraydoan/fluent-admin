// Fluent Select wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Select styling system-wide. Fluent Select is a native select:
// options are plain <option> children, not a separate Option component.
import {
  Select as FluentSelect,
  type SelectProps,
} from '@fluentui/react-components'

export function Select(props: SelectProps) {
  return <FluentSelect {...props} />
}
