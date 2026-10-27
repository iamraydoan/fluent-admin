// Fluent Button wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Button styling system-wide.
import {
  Button as FluentButton,
  type ButtonProps,
} from '@fluentui/react-components'

export function Button(props: ButtonProps) {
  return <FluentButton {...props} />
}
