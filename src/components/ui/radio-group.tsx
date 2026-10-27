// Fluent RadioGroup/Radio wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Radio styling system-wide.
import {
  Radio as FluentRadio,
  RadioGroup as FluentRadioGroup,
  type RadioGroupProps,
  type RadioProps,
} from '@fluentui/react-components'

export function RadioGroup(props: RadioGroupProps) {
  return <FluentRadioGroup {...props} />
}

export function Radio(props: RadioProps) {
  return <FluentRadio {...props} />
}
