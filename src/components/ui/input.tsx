// Fluent Input wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Input styling system-wide.
import {
  Input as FluentInput,
  type InputProps,
} from '@fluentui/react-components'

export function Input(props: InputProps) {
  return <FluentInput {...props} />
}
