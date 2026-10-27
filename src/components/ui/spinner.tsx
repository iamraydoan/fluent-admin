// Fluent Spinner wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Spinner styling system-wide.
import {
  Spinner as FluentSpinner,
  type SpinnerProps,
} from '@fluentui/react-components'

export function Spinner(props: SpinnerProps) {
  return <FluentSpinner {...props} />
}
