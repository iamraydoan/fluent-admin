// Role label wrapper, kept under its own name.
// Style-only: enforces the Fluent label standard (tint appearance,
// medium size, rounded shape) on top of the Badge wrapper. The caller
// supplies the role icon, so a role is never colour-only. Colour
// defaults to subtle (neutral): a role is a label, not a status, so
// it does not take a status colour. Edit this file to change
// role-label styling system-wide.
import type { ComponentProps } from 'react'
import { Badge } from './badge'

type RoleLabelProps = Omit<
  ComponentProps<typeof Badge>,
  'appearance' | 'size' | 'shape'
>

export function RoleLabel({ color, ...props }: RoleLabelProps) {
  return (
    <Badge
      {...props}
      appearance='tint'
      size='medium'
      shape='rounded'
      color={color ?? 'subtle'}
    />
  )
}
