// Fluent Link wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Link styling system-wide.
import { Link as FluentLink, type LinkProps } from '@fluentui/react-components'

export function Link(props: LinkProps) {
  return <FluentLink {...props} />
}
