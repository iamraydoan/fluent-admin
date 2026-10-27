import { makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  input: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    font: 'inherit',
    padding: '6px 12px',
    width: '240px',
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
})

type DatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
}

function toInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = 'Pick a date',
}: DatePickerProps) {
  const styles = useStyles()
  const today = toInputValue(new Date())
  return (
    <input
      type='date'
      className={styles.input}
      aria-label={placeholder}
      min='1900-01-01'
      max={today}
      value={selected ? toInputValue(selected) : ''}
      onChange={(event) => {
        const value = event.target.value
        if (!value) {
          onSelect(undefined)
          return
        }
        const [year, month, day] = value.split('-').map(Number)
        onSelect(new Date(year, month - 1, day))
      }}
    />
  )
}
