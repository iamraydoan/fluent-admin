// Fluent Label wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Label styling system-wide.
import {
  Label as FluentLabel,
  type LabelProps,
} from '@fluentui/react-components'

export function Label(props: LabelProps) {
  return <FluentLabel {...props} />
}
