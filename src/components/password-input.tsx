import * as React from 'react'
import { Eye20Regular, EyeOff20Regular } from '@fluentui/react-icons'
import { Button } from './ui/button'
import { Input } from './ui/input'

// Public API stays the native input shape (callers spread
// react-hook-form field props, whose value/defaultValue are the loose
// string | number | readonly string[] union), while the rendered
// element is ui/input. Fluent Input redefines value/defaultValue as
// string-only and size as 'small' | 'medium' | 'large', so those are
// normalized/dropped below instead of leaking the native shapes into
// the wrapper. In practice password values are always strings.
type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'onBlur'
> & {
  ref?: React.Ref<HTMLInputElement>
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

export function PasswordInput({
  disabled,
  ref,
  onChange,
  onBlur,
  value,
  defaultValue,
  // Fluent Input has no children slot, and its size is not the native
  // visible-width number — no caller passes either, so both are dropped.
  children: _children,
  size: _size,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <Input
      {...props}
      // ui/input is a plain function wrapper (not forwardRef), so the
      // ref travels as a spread prop — React 19 passes it through as
      // a prop to the wrapper and on to the Fluent inner input.
      {...(ref ? { ref } : {})}
      type={showPassword ? 'text' : 'password'}
      disabled={disabled}
      style={{ width: '100%' }}
      value={typeof value === 'string' ? value : undefined}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : undefined}
      // Fluent Input's onChange carries (event, data); callers (incl.
      // react-hook-form field props) still receive the plain event.
      onChange={(event) => onChange?.(event)}
      onBlur={(event) => onBlur?.(event)}
      contentAfter={
        <Button
          type='button'
          appearance='subtle'
          shape='square'
          size='small'
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          icon={showPassword ? <Eye20Regular /> : <EyeOff20Regular />}
          onClick={() => setShowPassword((prev) => !prev)}
        />
      }
    />
  )
}
