import { type Column } from '@tanstack/react-table'
import { tokens } from '@fluentui/react-components'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'

// Single-select dropdown filter: the field title lives OUTSIDE the
// select box as a separate label ("STATUS:", "PRIORITY:", "ROLE:"),
// like the field filters ("TITLE:", "EMAIL:"), and the select box
// itself only shows the bare value ("ALL", "Done", ...). The title
// must NOT be baked into the option text ("STATUS: ALL" inside the
// box) — that was the previous implementation and the user rejected
// it: the title inside the select box looks wrong.
//
// The column filter value stays a one-element array, exactly like the
// previous faceted multi-select, so the existing column filterFn
// (`value.includes(row value)`) and the URL array state keep working
// unchanged. Choosing ALL clears the column filter.
type DataTableSingleSelectFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title: string
  options: {
    label: string
    value: string
  }[]
}

export function DataTableSingleSelectFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableSingleSelectFilterProps<TData, TValue>) {
  if (!column) return null
  const selectedValues = column.getFilterValue() as string[] | undefined
  const selectedValue = selectedValues?.[0] ?? ''

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
      }}
    >
      <Text size={300}>{`${title}:`}</Text>
      <Select
        aria-label={`${title} filter`}
        value={selectedValue}
        onChange={(_, data) => {
          const value = data.value as string
          column.setFilterValue(value ? [value] : undefined)
        }}
      >
        <option value=''>ALL</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </span>
  )
}
