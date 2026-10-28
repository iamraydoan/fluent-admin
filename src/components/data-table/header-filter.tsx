import type { Column } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'

/**
 * Column-level text filter rendered in the filter row under the
 * column headers (one input per chosen column, other cells blank).
 * Live filtering: every keystroke updates the column filter
 * (cleared when the input is emptied), so it behaves like the
 * toolbar Search box, scoped to one column.
 *
 * The value is table-local only: it is not part of the URL-synced
 * filter config, so it filters in-memory and resets on reload. That
 * is deliberate — adding it to the URL schema is a route change,
 * not a table change.
 */
type DataTableHeaderFilterProps<TData, TValue> = {
  column: Column<TData, TValue>
  label: string
}

export function DataTableHeaderFilter<TData, TValue>({
  column,
  label,
}: DataTableHeaderFilterProps<TData, TValue>) {
  const value = (column.getFilterValue() as string | undefined) ?? ''
  return (
    <Input
      size='small'
      aria-label={`Filter ${label}`}
      placeholder='Filter…'
      value={value}
      onChange={(_, data) =>
        column.setFilterValue(data.value ? data.value : undefined)
      }
      style={{ width: '100%', minWidth: 0 }}
    />
  )
}
