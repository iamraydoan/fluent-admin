import { Select } from '@/components/ui/select'

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
  // Fluent Select is a native select underneath (see ui/select.tsx):
  // options stay plain <option> children, and onChange carries
  // (event, data) with the new value in data.value.
  const handleChange = (
    _: React.ChangeEvent<HTMLSelectElement>,
    data: { value: string }
  ) => onValueChange?.(data.value)
  const controlled = isControlled
    ? {
        value: defaultValue ?? '',
        onChange: handleChange,
      }
    : {
        defaultValue: defaultValue ?? '',
        onChange: handleChange,
      }
  return (
    <Select
      {...controlled}
      disabled={disabled}
      style={{ width: '100%' }}
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
    </Select>
  )
}
