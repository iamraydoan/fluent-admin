// Fluent Avatar wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Avatar styling system-wide.
import {
  Avatar as FluentAvatar,
  type AvatarProps,
} from '@fluentui/react-components'

export function Avatar(props: AvatarProps) {
  return <FluentAvatar {...props} />
}
