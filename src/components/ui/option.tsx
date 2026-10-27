// Fluent Option wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Option styling system-wide. These are the options used inside
// a Combobox. There is no Fluent Dropdown component.
import {
  Option as FluentOption,
  OptionGroup as FluentOptionGroup,
  type OptionGroupProps,
  type OptionProps,
} from '@fluentui/react-components'

export function Option(props: OptionProps) {
  return <FluentOption {...props} />
}

export function OptionGroup(props: OptionGroupProps) {
  return <FluentOptionGroup {...props} />
}
