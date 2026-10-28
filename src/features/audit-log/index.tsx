import { useState } from 'react'
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
import { Card } from '@/components/ui/card'
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
import { auditActions, auditActors, auditEvents, type AuditEvent } from './data'

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
    borderRadius: tokens.borderRadiusMedium,
  },
  headerCell: {
    textTransform: 'uppercase',
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    zIndex: 1,
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
        {new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(row.original.timestamp)}
      </span>
    ),
    enableSorting: false,
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
  },
  {
    accessorKey: 'entity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ENTITY' />
    ),
    cell: ({ row }) => <LongText>{row.getValue('entity')}</LongText>,
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='BEFORE / AFTER' />
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: auditEvents,
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
            borderRadius: tokens.borderRadiusMedium,
            boxShadow: tokens.shadow2,
          }}
        >
          <div className={styles.cardBody}>
            <Text>
              Mock data only: these events are generated locally and are not
              captured from a real audit system.
            </Text>
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
