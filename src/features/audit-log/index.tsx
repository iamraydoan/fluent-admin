import { useMemo, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ArrowClockwise24Regular } from '@fluentui/react-icons'
import { formatDateTimeLocal } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import {
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
} from '@/components/data-table'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
import { LongText } from '@/components/long-text'
import {
  auditActions,
  auditActors,
  auditEntities,
  auditEvents,
  type AuditEvent,
} from './data'

const useStyles = makeStyles({
  content: {
    flex: '1',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardBody: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
  },
  tableWrap: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusXLarge,
  },
  headerCell: {
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1,
  },
  periodRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  emptyCell: {
    textAlign: 'center',
    paddingTop: '48px',
    paddingBottom: '48px',
  },
})

const actionColors: Record<
  AuditEvent['action'],
  'success' | 'informative' | 'danger' | 'subtle'
> = {
  Created: 'success',
  Updated: 'informative',
  Deleted: 'danger',
  Exported: 'subtle',
}

const columns: ColumnDef<AuditEvent>[] = [
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='WHEN' />
    ),
    cell: ({ row }) => (
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {formatDateTimeLocal(row.original.timestamp)}
      </span>
    ),
    enableSorting: false,
    // WHEN must stay visible: hiding the timestamp column would leave
    // rows undated, so it is excluded from the View column menu.
    enableHiding: false,
  },
  {
    accessorKey: 'actor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ACTOR' />
    ),
    cell: ({ row }) => <LongText>{row.getValue('actor')}</LongText>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ACTION' />
    ),
    cell: ({ row }) => (
      <StatusBadge color={actionColors[row.original.action]}>
        {row.getValue('action')}
      </StatusBadge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    // ACTION must stay visible alongside WHEN: it is excluded from
    // the View column menu for the same reason.
    enableHiding: false,
  },
  {
    accessorKey: 'entity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ENTITY' />
    ),
    cell: ({ row }) => <LongText>{row.getValue('entity')}</LongText>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },
  {
    accessorKey: 'entityName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='RECORD' />
    ),
    cell: ({ row }) => <LongText>{row.getValue('entityName')}</LongText>,
    enableSorting: false,
  },
  {
    accessorKey: 'summary',
    // Renamed from BEFORE / AFTER: the mock rows carry a one-line
    // summary, not a real before/after diff, so the old title promised
    // data that does not exist yet.
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SUMMARY' />
    ),
    cell: ({ row }) => <LongText>{row.getValue('summary')}</LongText>,
    enableSorting: false,
  },
]

export function AuditLog() {
  const styles = useStyles()
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: unknown }[]
  >([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 })
  const [period, setPeriod] = useState<'all' | '24h' | '7d' | '30d'>('all')

  // Switching period shrinks the row set, so return to page 1:
  // otherwise a later page (e.g. page 4 of 80) would show an empty
  // "No results." table under Last 24h (4 rows).
  const handlePeriodChange = (value: 'all' | '24h' | '7d' | '30d') => {
    setPeriod(value)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  // Date-range choice (documented): the last 24h / 7d / 30d select,
  // reusing the single-select pattern, instead of a date-range picker.
  // Ranges are relative to the newest mock event, not wall-clock now:
  // the mock data is fixed at Oct 2026, so wall-clock ranges would
  // show an empty table for 24h/7d.
  const filteredEvents = useMemo(() => {
    if (period === 'all') return auditEvents
    const latest = Math.max(...auditEvents.map((e) => e.timestamp.getTime()))
    const hours = period === '24h' ? 24 : period === '7d' ? 24 * 7 : 24 * 30
    return auditEvents.filter(
      (event) => latest - event.timestamp.getTime() < hours * 60 * 60 * 1000
    )
  }, [period])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredEvents,
    columns,
    state: { columnFilters, globalFilter, pagination },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, filterValue) => {
      const event = row.original
      const haystack =
        `${event.actor} ${event.action} ${event.entity} ${event.entityName} ${event.summary}`.toLowerCase()
      return haystack.includes(String(filterValue).toLowerCase())
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const filteredCount = table.getFilteredRowModel().rows.length

  const handleRefresh = () => {
    setColumnFilters([])
    setGlobalFilter('')
    setPagination({ pageIndex: 0, pageSize: 25 })
    setPeriod('all')
  }

  return (
    <>
      <PageTop
        title='Audit Log'
        actionBar={
          <ActionBar
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise24Regular />,
                    onClick: handleRefresh,
                  },
                ],
              },
            ]}
          />
        }
      />
      <div className={styles.content}>
        <Card
          className={styles.card}
          style={{
            borderRadius: tokens.borderRadiusXLarge,
            boxShadow: tokens.shadow2,
          }}
        >
          <div className={styles.cardBody}>
            <Text>
              Mock data only: these events are generated locally and are not
              captured from a real audit system. Times are shown in local time
              with seconds.
            </Text>
            <div className={styles.periodRow}>
              <Text size={300}>PERIOD:</Text>
              <Select
                aria-label='Period filter'
                value={period}
                onChange={(_, data) =>
                  handlePeriodChange(data.value as 'all' | '24h' | '7d' | '30d')
                }
              >
                <option value='all'>ALL</option>
                <option value='24h'>Last 24h</option>
                <option value='7d'>Last 7d</option>
                <option value='30d'>Last 30d</option>
              </Select>
            </div>
            <div style={{ display: 'contents' }}>
              <DataTableToolbar
                table={table}
                heading={`Audit Log (${filteredCount})`}
                searchPlaceholder='Search'
                singleSelectFilters={[
                  {
                    columnId: 'actor',
                    title: 'ACTOR',
                    options: auditActors.map((actor) => ({
                      label: actor,
                      value: actor,
                    })),
                  },
                  {
                    columnId: 'action',
                    title: 'ACTION',
                    options: auditActions.map(({ label, value }) => ({
                      label,
                      value,
                    })),
                  },
                  {
                    columnId: 'entity',
                    title: 'ENTITY',
                    options: auditEntities.map((entity) => ({
                      label: entity,
                      value: entity,
                    })),
                  },
                ]}
              />
              <div className={styles.tableWrap}>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHeaderCell
                            key={header.id}
                            colSpan={header.colSpan}
                            className={styles.headerCell}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHeaderCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
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
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
