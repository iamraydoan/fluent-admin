import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type ColumnSizingState,
  type SortingState,
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
import {
  DENSITY_ROW_HEIGHTS,
  DataTableHeaderFilter,
  DataTablePagination,
  DataTableToolbar,
  getNumericCellStyle,
  getPinnedCellStyle,
  getSizedColumnWidth,
  useDataTableSharedStyles,
  usePersistedColumnVisibility,
  useTableDensity,
} from '@/components/data-table'
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
    gap: tokens.spacingVerticalL,
  },
  tableWrap: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'auto',
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  // Row/header heights come from the density (Compact 32px /
  // Standard 40px, see DENSITY_ROW_HEIGHTS), applied as inline
  // height styles below; these classes only carry the padding.
  // Body padding is token spacing: Compact 0 (the 32px Checkbox
  // fills the row exactly), Standard 4px top/bottom (32 + 8 = 40).
  // Header padding: Compact 4px, Standard 8px around the small
  // header buttons, with the row height style forcing the total.
  padBodyCompact: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  padBodyStandard: {
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
  },
  padHeaderCompact: {
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
  },
  padHeaderStandard: {
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
  },
  // Sticky header: stays at the top of the scroll container while
  // the body scrolls underneath. The background must be a solid
  // theme token (not transparent, not hardcoded white) or scrolling
  // rows would show through; Background3 matches the MES ToolTable
  // header band in both light and dark themes. zIndex 3 keeps the
  // whole header row above pinned body cells (z 1, see
  // getPinnedCellStyle) during vertical scroll.
  headerCell: {
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    zIndex: 3,
  },
  emptyCell: {
    textAlign: 'center',
    paddingTop: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXL,
  },
})

type DataTableProps = {
  data: Task[]
  // Called with the filtered selected-row count whenever selection
  // changes, so a parent (the Tasks screen ActionBar) can enable /
  // disable selection-driven actions. Optional: the table works
  // unchanged without it.
  onSelectionChange?: (selectedCount: number) => void
}

export function TasksTable({ data, onSelectionChange }: DataTableProps) {
  const styles = useStyles()
  const sharedStyles = useDataTableSharedStyles()
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  // Column visibility persists per table in localStorage.
  const [columnVisibility, onColumnVisibilityChange] =
    usePersistedColumnVisibility('tasks-column-visibility')
  // Row density persists per table in localStorage.
  const [density, setDensity] = useTableDensity('tasks-table-density')
  const rowHeight = DENSITY_ROW_HEIGHTS[density]
  // Column sizing is in-memory only (not persisted): pinned columns
  // get exact widths here so their sticky left offsets are exact
  // (select: 32px Checkbox + 16px cell padding; id: 80px id text +
  // 16px cell padding). Resized columns gain a width style below.
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({
    select: 48,
    id: 96,
  })

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
      columnSizing,
    },
    // Pinned left columns: the row checkbox + the first data column
    // (TASK). initialState (not controlled state) because no UI
    // changes pinning; resizing below is controlled instead.
    initialState: {
      columnPinning: { left: ['select', 'id'] },
    },
    columnResizeMode: 'onChange',
    onColumnSizingChange: setColumnSizing,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange,
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

  // Lift selection count only (not the table instance): the parent
  // re-renders on count change but rowSelection itself is unchanged,
  // so this effect does not loop.
  useEffect(() => {
    onSelectionChange?.(table.getFilteredSelectedRowModel().rows.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])

  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className={styles.root}>
      <DataTableToolbar
        table={table}
        heading={`Tasks (${filteredCount})`}
        searchPlaceholder='Search'
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
        density={density}
        onDensityChange={setDensity}
      />
      <div className={styles.tableWrap}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} style={{ height: rowHeight }}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHeaderCell
                      key={header.id}
                      colSpan={header.colSpan}
                      className={`${styles.headerCell} ${density === 'compact' ? styles.padHeaderCompact : styles.padHeaderStandard}`}
                      style={{
                        height: rowHeight,
                        ...getSizedColumnWidth(header.column, columnSizing),
                        ...getPinnedCellStyle(header.column, true),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {!header.isPlaceholder && (
                        <div
                          data-resize-handle={header.column.id}
                          className={`${sharedStyles.resizeHandle} ${header.column.getIsResizing() ? sharedStyles.resizeHandleActive : ''}`}
                          // Seed an explicit size from the rendered
                          // width on hover: TanStack's drag math
                          // starts from column.getSize(), which is
                          // its 150px default for auto-width columns,
                          // so an unseeded first drag can shrink a
                          // wide column. Seeding on hover (before
                          // mousedown captures the start size) makes
                          // drags grow/shrink from the visible width.
                          // Pinned columns already have exact sizes
                          // and are skipped. Touch drags have no
                          // hover, so they still start from 150px.
                          onMouseEnter={(event) => {
                            const cell = event.currentTarget.closest('th')
                            const width = cell
                              ? Math.round(cell.getBoundingClientRect().width)
                              : undefined
                            if (
                              width &&
                              columnSizing[header.column.id] === undefined
                            ) {
                              setColumnSizing((prev) => ({
                                ...prev,
                                [header.column.id]: width,
                              }))
                            }
                          }}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                        />
                      )}
                    </TableHeaderCell>
                  )
                })}
              </TableRow>
            ))}
            {/* Filter row: one text filter per chosen column (TASK
                id, which has no toolbar filter); other cells stay
                blank. Stuck under the main header row (top =
                density row height) so both bands stay visible while
                the body scrolls. */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={`${headerGroup.id}-filters`}>
                {headerGroup.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`${styles.headerCell} ${styles.padHeaderCompact}`}
                    style={{
                      top: rowHeight,
                      ...getSizedColumnWidth(header.column, columnSizing),
                      ...getPinnedCellStyle(header.column, true),
                    }}
                  >
                    {header.column.id === 'id' && !header.isPlaceholder && (
                      <DataTableHeaderFilter
                        column={header.column}
                        label='TASK'
                      />
                    )}
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} style={{ height: rowHeight }}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        density === 'compact'
                          ? styles.padBodyCompact
                          : styles.padBodyStandard
                      }
                      style={{
                        height: rowHeight,
                        ...getSizedColumnWidth(cell.column, columnSizing),
                        ...getPinnedCellStyle(cell.column, false),
                        ...getNumericCellStyle(cell.column.id),
                      }}
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
