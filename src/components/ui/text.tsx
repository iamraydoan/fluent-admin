// Fluent Text wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Text styling system-wide.
import { Text as FluentText, type TextProps } from '@fluentui/react-components'

export function Text(props: TextProps) {
  return <FluentText {...props} />
}
