import { useEffect, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { roles } from '../data/data'
import { type User } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns as columns } from './users-columns'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    gap: '16px',
  },
  tableWrap: {
    overflow: 'hidden',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  // Entity Types pattern: 35px rows, uppercase headers, vertical dividers.
  bodyRow: {
    height: '35px',
  },
  headerRow: {
    height: '35px',
  },
  headerCell: {
    textTransform: 'uppercase',
  },
  dividerCell: {
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  // Body rows are driven by the 32px Fluent Checkbox, so 1px vertical
  // padding lands the row at ~35px; header sort buttons are shorter,
  // so header cells get 5px to land at the same height.
  padBodyCell: {
    paddingTop: '1px',
    paddingBottom: '1px',
  },
  padHeaderCell: {
    paddingTop: '5px',
    paddingBottom: '5px',
  },
  emptyCell: {
    textAlign: 'center',
    paddingTop: '48px',
    paddingBottom: '48px',
  },
})

type DataTableProps = {
  data: User[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function UsersTable({ data, search, navigate }: DataTableProps) {
  const styles = useStyles()
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // Synced with URL states (keys/defaults mirror users route search schema)
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      // username per-column text filter
      { columnId: 'username', searchKey: 'username', type: 'string' },
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'role', searchKey: 'role', type: 'array' },
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className={styles.root}>
      <DataTableToolbar
        table={table}
        heading={`Users (${filteredCount})`}
        searchPlaceholder='Search'
        searchKey='username'
        filters={[
          {
            columnId: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Invited', value: 'invited' },
              { label: 'Suspended', value: 'suspended' },
            ],
          },
          {
            columnId: 'role',
            title: 'Role',
            options: roles.map(({ label, value }) => ({ label, value })),
          },
        ]}
      />
      <div className={styles.tableWrap}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={styles.headerRow}>
                {headerGroup.headers.map((header, headerIndex) => {
                  return (
                    <TableHeaderCell
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`${styles.headerCell} ${styles.padHeaderCell} ${headerIndex < headerGroup.headers.length - 1 ? styles.dividerCell : ''}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHeaderCell>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={styles.bodyRow}>
                  {row.getVisibleCells().map((cell, cellIndex, cells) => (
                    <TableCell
                      key={cell.id}
                      className={`${styles.padBodyCell} ${cellIndex < cells.length - 1 ? styles.dividerCell : ''}`}
                      // Fluent's default cell height floors rows at 44px;
                      // inline height overrides it to the 35px list pattern.
                      style={{ height: '35px' }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={styles.emptyCell}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <DataTableBulkActions table={table} />
    </div>
  )
}
