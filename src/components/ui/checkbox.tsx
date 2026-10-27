// Fluent Checkbox wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Checkbox styling system-wide.
import {
  Checkbox as FluentCheckbox,
  type CheckboxProps,
} from '@fluentui/react-components'

export function Checkbox(props: CheckboxProps) {
  return <FluentCheckbox {...props} />
}
