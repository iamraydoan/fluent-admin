import { useState } from 'react'
import { type ColumnSizingState, type Table } from '@tanstack/react-table'
import { Checkmark20Regular, Options20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupHeader,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { getColumnHeaderLabel, getHideableColumns } from './column-label'
import { DataTableColumnOptionsDialog } from './column-options-dialog'
import { showAllColumns, type TableDensity } from './data-table-state'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
  density?: TableDensity
  onDensityChange?: (density: TableDensity) => void
}

/**
 * Column sizing lives ONLY in this View menu — not in the Column
 * Options wizard and not in column header menus — so there is one
 * place to find it. Manual drag resize on the header resize
 * handles is untouched; these commands only set columnSizing
 * state, which the same width path renders.
 *
 * - Fit to headers: width from the header label length.
 * - Fit to cells: width from the longest filtered cell value.
 * - Auto fit: the larger of the two, per column.
 * - Fit to grid width: Auto fit widths scaled proportionally so
 *   the visible columns fill the table container width.
 */
function estimateHeaderWidth(label: string): number {
  return Math.min(280, Math.max(72, label.length * 9 + 64))
}

function estimateCellWidth<TData>(
  table: Table<TData>,
  columnId: string
): number {
  let maxChars = 0
  for (const row of table.getFilteredRowModel().rows) {
    const value = row.getValue(columnId)
    if (value === null || value === undefined) continue
    maxChars = Math.max(maxChars, String(value).length)
  }
  return Math.min(360, Math.max(72, Math.round(maxChars * 7.5 + 36)))
}

function fitWidths<TData>(
  table: Table<TData>,
  mode: 'headers' | 'cells' | 'auto' | 'grid'
): ColumnSizingState {
  const visible = table
    .getAllColumns()
    .filter((column) => column.getIsVisible())
  const sizes: ColumnSizingState = {}
  // The select checkbox column keeps its fixed width; the actions
  // column holds one row-action button.
  const FIXED: Record<string, number> = { select: 48, actions: 56 }
  for (const column of visible) {
    if (FIXED[column.id] !== undefined) {
      sizes[column.id] = FIXED[column.id]
      continue
    }
    const headerWidth = estimateHeaderWidth(getColumnHeaderLabel(column))
    const cellWidth = estimateCellWidth(table, column.id)
    sizes[column.id] =
      mode === 'headers'
        ? headerWidth
        : mode === 'cells'
          ? cellWidth
          : Math.max(headerWidth, cellWidth)
  }
  if (mode !== 'grid') return sizes
  const containerWidth =
    document.querySelector('table')?.parentElement?.clientWidth ?? 0
  const scalable = visible.filter((column) => FIXED[column.id] === undefined)
  const scaledTotal = scalable.reduce(
    (sum, column) => sum + (sizes[column.id] ?? 0),
    0
  )
  const fixedTotal = visible.reduce(
    (sum, column) => sum + (FIXED[column.id] ?? 0),
    0
  )
  const target = containerWidth - fixedTotal
  if (target <= 0 || scaledTotal <= 0) return sizes
  const factor = target / scaledTotal
  for (const column of scalable) {
    sizes[column.id] = Math.max(
      48,
      Math.round((sizes[column.id] ?? 0) * factor)
    )
  }
  return sizes
}

export function DataTableViewOptions<TData>({
  table,
  density,
  onDensityChange,
}: DataTableViewOptionsProps<TData>) {
  const [optionsOpen, setOptionsOpen] = useState(false)
  const hideableColumns = getHideableColumns(table.getAllColumns())

  return (
    <>
      <Menu>
        <MenuTrigger>
          <Button appearance='outline' size='small' icon={<Options20Regular />}>
            View
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuGroup>
              <MenuGroupHeader>Columns</MenuGroupHeader>
              {hideableColumns.map((column) => {
                return (
                  <MenuItem
                    key={column.id}
                    icon={
                      column.getIsVisible() ? <Checkmark20Regular /> : undefined
                    }
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    {getColumnHeaderLabel(column)}
                  </MenuItem>
                )
              })}
              <MenuItem onClick={() => showAllColumns(table)}>
                Show all columns
              </MenuItem>
            </MenuGroup>
            <MenuGroup>
              <MenuGroupHeader>Column options</MenuGroupHeader>
              <MenuItem onClick={() => setOptionsOpen(true)}>
                Column options…
              </MenuItem>
            </MenuGroup>
            <MenuGroup>
              <MenuGroupHeader>Column sizing</MenuGroupHeader>
              <MenuItem
                onClick={() =>
                  table.setColumnSizing(fitWidths(table, 'headers'))
                }
              >
                Fit to headers
              </MenuItem>
              <MenuItem
                onClick={() => table.setColumnSizing(fitWidths(table, 'cells'))}
              >
                Fit to cells
              </MenuItem>
              <MenuItem
                onClick={() => table.setColumnSizing(fitWidths(table, 'auto'))}
              >
                Auto fit
              </MenuItem>
              <MenuItem
                onClick={() => table.setColumnSizing(fitWidths(table, 'grid'))}
              >
                Fit to grid width
              </MenuItem>
            </MenuGroup>
            {density && onDensityChange && (
              <MenuGroup>
                <MenuGroupHeader>Density</MenuGroupHeader>
                <MenuItem
                  icon={
                    density === 'compact' ? <Checkmark20Regular /> : undefined
                  }
                  onClick={() => onDensityChange('compact')}
                >
                  Compact
                </MenuItem>
                <MenuItem
                  icon={
                    density === 'standard' ? <Checkmark20Regular /> : undefined
                  }
                  onClick={() => onDensityChange('standard')}
                >
                  Standard
                </MenuItem>
              </MenuGroup>
            )}
          </MenuList>
        </MenuPopover>
      </Menu>
      {optionsOpen && (
        <DataTableColumnOptionsDialog
          table={table}
          open={optionsOpen}
          onOpenChange={setOptionsOpen}
        />
      )}
    </>
  )
}
