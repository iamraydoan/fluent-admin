// Fluent Combobox wrapper, kept under its original name.
// Pass-through only: no style or behaviour change. Edit this file to
// change Combobox styling system-wide. Options are the Option wrapper
// in ./option.tsx. There is no Fluent Dropdown component; Combobox
// (or Select) is the replacement for the old dropdown selects.
import {
  Combobox as FluentCombobox,
  type ComboboxProps,
} from '@fluentui/react-components'

export function Combobox(props: ComboboxProps) {
  return <FluentCombobox {...props} />
}
