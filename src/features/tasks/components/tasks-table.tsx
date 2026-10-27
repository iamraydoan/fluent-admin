import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
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
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { tasksColumns as columns } from './tasks-columns'

const route = getRouteApi('/_authenticated/tasks/')

const useStyles = makeStyles({
  // Full-height list layout: this root fills the card body (which
  // fills the card, which fills the page column bounded by the
  // 100vh shell), and only tableWrap below scrolls. Toolbar and
  // pagination are flexShrink 0 in their shared components, so they
  // stay put above / below the scroll area and never get pushed
  // below the viewport fold, even with 25 rows x 35px.
  root: {
    display: 'flex',
    flex: '1',
    minHeight: 0,
    overflow: 'hidden',
    flexDirection: 'column',
    gap: '16px',
  },
  tableWrap: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
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
  // Sticky header: stays at the top of the scroll container while
  // the body scrolls underneath. The background must be a solid
  // theme token (not transparent, not hardcoded white) or scrolling
  // rows would show through; Background3 matches the MES ToolTable
  // header band in both light and dark themes.
  headerCell: {
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    zIndex: 1,
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
    paddingTop: '24px',
    paddingBottom: '24px',
  },
})

type DataTableProps = {
  data: Task[]
}

export function TasksTable({ data }: DataTableProps) {
  const styles = useStyles()
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Synced with URL states (updated to match route search schema defaults)
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 25 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'array' },
      { columnId: 'priority', searchKey: 'priority', type: 'array' },
      { columnId: 'title', searchKey: 'title', type: 'string' },
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue('id')).toLowerCase()
      const title = String(row.getValue('title')).toLowerCase()
      const searchValue = String(filterValue).toLowerCase()

      return id.includes(searchValue) || title.includes(searchValue)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  })

  const pageCount = table.getPageCount()
  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className={styles.root}>
      <DataTableToolbar
        table={table}
        heading={`Tasks (${filteredCount})`}
        singleSelectFilters={[
          {
            columnId: 'status',
            title: 'STATUS',
            options: statuses.map(({ label, value }) => ({ label, value })),
          },
          {
            columnId: 'priority',
            title: 'PRIORITY',
            options: priorities.map(({ label, value }) => ({ label, value })),
          },
        ]}
        fieldFilters={[{ columnId: 'title', label: 'TITLE' }]}
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
