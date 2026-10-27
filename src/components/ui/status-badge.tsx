// Status badge wrapper, kept under its own name.
// Style-only: enforces the Fluent status standard (tint appearance,
// medium size, rounded shape) on top of the Badge wrapper. The caller
// supplies colour (via the existing status->colour mapping) and an
// icon or dot, so status is never colour-only. Edit this file to
// change status-badge styling system-wide.
import type { ComponentProps } from 'react'
import { Badge } from './badge'

type StatusBadgeProps = Omit<
  ComponentProps<typeof Badge>,
  'appearance' | 'size' | 'shape'
>

export function StatusBadge(props: StatusBadgeProps) {
  return <Badge {...props} appearance='tint' size='medium' shape='rounded' />
}
