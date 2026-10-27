import * as React from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Eye20Regular, EyeOff20Regular } from '@fluentui/react-icons'
import { Button } from './ui/button'

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    font: 'inherit',
    padding: '6px 40px 6px 12px',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  toggle: {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
})

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  ref?: React.Ref<HTMLInputElement>
}

export function PasswordInput({ disabled, ref, ...props }: PasswordInputProps) {
  const styles = useStyles()
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className={styles.wrapper}>
      <input
        type={showPassword ? 'text' : 'password'}
        className={styles.input}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <span className={styles.toggle}>
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
      </span>
    </div>
  )
}
