// Fluent Textarea wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Textarea styling system-wide.
import {
  Textarea as FluentTextarea,
  type TextareaProps,
} from '@fluentui/react-components'

export function Textarea(props: TextareaProps) {
  return <FluentTextarea {...props} />
}
