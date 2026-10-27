import { useState } from 'react'
import { type Column } from '@tanstack/react-table'
import { tokens } from '@fluentui/react-components'
import { Filter20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'

// Field-specific text filter, in the Integration Handler style:
// a label ("NAME:", "TITLE:", "EMAIL:") + a text input + a funnel
// button. Fluent has no "funnel" icon; Filter20Regular is its
// funnel-equivalent and is what the button uses.
//
// This is NOT the global Search box: it filters one column only.
// The value is applied when the funnel button is clicked (or Enter
// is pressed in the input), not on every keystroke, so typing does
// not re-filter the table mid-word. Clearing the input and applying
// clears the column filter. The draft syncs back from the column
// filter value, so the toolbar Reset button also clears this input.
type DataTableFieldFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  label: string
}

export function DataTableFieldFilter<TData, TValue>({
  column,
  label,
}: DataTableFieldFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as string | undefined
  const [draft, setDraft] = useState(filterValue ?? '')
  // Sync the draft back when the column filter changes externally
  // (e.g. the toolbar Reset button clears it). This uses React's
  // "adjust state during render" pattern, not a setState-in-effect,
  // so the draft never goes stale after an external clear.
  const [prevFilterValue, setPrevFilterValue] = useState(filterValue)
  if (filterValue !== prevFilterValue) {
    setPrevFilterValue(filterValue)
    setDraft(filterValue ?? '')
  }

  if (!column) return null

  const apply = () => {
    const value = draft.trim()
    column.setFilterValue(value ? value : undefined)
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
      }}
    >
      <Text size={300}>{`${label}:`}</Text>
      <Input
        aria-label={`${label} filter`}
        style={{ width: '200px', maxWidth: '100%' }}
        value={draft}
        onChange={(_, data) => setDraft(data.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') apply()
        }}
      />
      <Tooltip content={`Apply ${label} filter`} relationship='label'>
        <Button
          appearance='outline'
          size='small'
          icon={<Filter20Regular />}
          aria-label={`Apply ${label} filter`}
          onClick={apply}
        />
      </Tooltip>
    </span>
  )
}
