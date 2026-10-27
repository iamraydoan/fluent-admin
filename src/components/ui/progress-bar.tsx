// Fluent ProgressBar wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change ProgressBar styling system-wide.
import {
  ProgressBar as FluentProgressBar,
  type ProgressBarProps,
} from '@fluentui/react-components'

export function ProgressBar(props: ProgressBarProps) {
  return <FluentProgressBar {...props} />
}
