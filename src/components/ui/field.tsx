// Fluent Field wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Field styling system-wide.
import {
  Field as FluentField,
  type FieldProps,
} from '@fluentui/react-components'

export function Field(props: FieldProps) {
  return <FluentField {...props} />
}
