import { type ColumnDef, type Row } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@/components/ui/link'
import { DataTableColumnHeader } from '@/components/data-table'
import { labels, priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { useTasks } from './tasks-provider'

// Title is the natural first-column link: clicking it opens the same
// update drawer the row-actions Edit menu opens (no new route invented).
// eslint-disable-next-line react-refresh/only-export-components
function TaskTitleCell({ row }: { row: Row<Task> }) {
  const { setOpen, setCurrentRow } = useTasks()
  const label = labels.find((label) => label.value === row.original.label)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
      }}
    >
      {label && (
        <Badge
          appearance='outline'
          style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {label.label}
        </Badge>
      )}
      <Link
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('update')
        }}
        style={{
          minWidth: 0,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontWeight: 600,
        }}
      >
        {row.getValue('title')}
      </Link>
    </div>
  )
}

export const tasksColumns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'mixed')
        }
        onChange={(_, data) => table.toggleAllPageRowsSelected(!!data.checked)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(_, data) => row.toggleSelected(!!data.checked)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Task' />
    ),
    cell: ({ row }) => (
      <div style={{ width: '80px' }}>{row.getValue('id')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => <TaskTitleCell row={row} />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      const StatusIcon = status.icon
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100px',
          }}
        >
          <StatusIcon aria-hidden='true' />
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )

      if (!priority) {
        return null
      }

      const PriorityIcon = priority.icon
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PriorityIcon aria-hidden='true' />
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
