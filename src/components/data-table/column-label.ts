import { isValidElement } from 'react'
import type { Column } from '@tanstack/react-table'

/**
 * Human label for a column, taken from its header title — never
 * from column.id. Most data-table headers render
 * <DataTableColumnHeader column={column} title="NAME" />, so the
 * title is read back from the header element itself: calling the
 * header function only creates the element, it does not run the
 * header component, so no hooks execute here. Columns whose header
 * is not a titled element (the select checkbox header, the actions
 * column) fall back to the id split into words and upper-cased
 * ("phoneNumber" -> "PHONE NUMBER"); the one case that fallback
 * gets wrong ("fullName" -> "FULL NAME" instead of "NAME") is
 * covered because fullName does use a titled header.
 */
export function getColumnHeaderLabel<TData>(
  column: Column<TData, unknown>
): string {
  const header = column.columnDef.header
  if (typeof header === 'function') {
    try {
      const element = (
        header as (ctx: { column: Column<TData, unknown> }) => unknown
      )({ column })
      if (isValidElement(element)) {
        const title = (element.props as { title?: unknown }).title
        if (typeof title === 'string' && title) return title
      }
    } catch {
      // Header needs more context than { column } (e.g. the select
      // header reads the table): fall through to the id fallback.
    }
  }
  if (typeof header === 'string' && header) return header
  return column.id
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toUpperCase()
}

/** Columns the user may show, hide and reorder: hideable only. */
export function getHideableColumns<TData>(
  columns: Column<TData, unknown>[]
): Column<TData, unknown>[] {
  return columns.filter((column) => column.getCanHide())
}
