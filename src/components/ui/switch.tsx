// Fluent Switch wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Switch styling system-wide.
import {
  Switch as FluentSwitch,
  type SwitchProps,
} from '@fluentui/react-components'

export function Switch(props: SwitchProps) {
  return <FluentSwitch {...props} />
}
