import { makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  select: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    font: 'inherit',
    padding: '6px 8px',
    width: '100%',
  },
})

type SelectDropdownProps = {
  onValueChange?: (value: string) => void
  defaultValue: string | undefined
  placeholder?: string
  isPending?: boolean
  items: { label: string; value: string }[] | undefined
  disabled?: boolean
  /** Accepted for API compatibility with existing callers; no longer applied. */
  className?: string
  isControlled?: boolean
}

export function SelectDropdown({
  defaultValue,
  onValueChange,
  isPending,
  items,
  placeholder,
  disabled,
  isControlled = false,
}: SelectDropdownProps) {
  const styles = useStyles()
  const controlled = isControlled
    ? {
        value: defaultValue ?? '',
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          onValueChange?.(event.target.value),
      }
    : {
        defaultValue: defaultValue ?? '',
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          onValueChange?.(event.target.value),
      }
  return (
    <select
      {...controlled}
      disabled={disabled}
      className={styles.select}
      aria-label={placeholder ?? 'Select'}
    >
      {placeholder && (
        <option value='' disabled>
          {placeholder}
        </option>
      )}
      {isPending ? (
        <option value='loading' disabled>
          Loading...
        </option>
      ) : (
        items?.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))
      )}
    </select>
  )
}
