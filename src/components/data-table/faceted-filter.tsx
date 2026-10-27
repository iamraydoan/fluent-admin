import * as React from 'react'
import { type Column } from '@tanstack/react-table'
import { AddCircle20Regular, Checkmark20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Text } from '@/components/ui/text'

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  const toggle = (value: string) => {
    if (selectedValues.has(value)) {
      selectedValues.delete(value)
    } else {
      selectedValues.add(value)
    }
    const filterValues = Array.from(selectedValues)
    column?.setFilterValue(filterValues.length ? filterValues : undefined)
  }

  const selectedLabel =
    selectedValues.size > 0
      ? selectedValues.size > 2
        ? `${selectedValues.size} selected`
        : options
            .filter((option) => selectedValues.has(option.value))
            .map((option) => option.label)
            .join(', ')
      : ''

  return (
    <Menu>
      <MenuTrigger>
        <Button appearance='outline' size='small' icon={<AddCircle20Regular />}>
          {title}
          {selectedLabel ? ` (${selectedLabel})` : ''}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value)
            return (
              <MenuItem
                key={option.value}
                icon={isSelected ? <Checkmark20Regular /> : undefined}
                onClick={() => toggle(option.value)}
              >
                {option.label}
                {facets?.get(option.value) ? (
                  <Text size={200}> {facets.get(option.value)}</Text>
                ) : null}
              </MenuItem>
            )
          })}
          {selectedValues.size > 0 && (
            <MenuItem onClick={() => column?.setFilterValue(undefined)}>
              Clear filters
            </MenuItem>
          )}
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
