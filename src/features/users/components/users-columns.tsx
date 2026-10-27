import { type ColumnDef, type Row } from '@tanstack/react-table'
import { tokens } from '@fluentui/react-components'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@/components/ui/link'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes, roles } from '../data/data'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { useUsers } from './users-provider'

// Username is the natural first-column link: clicking it opens the same
// edit dialog the row-actions Edit menu opens (no new route invented).
// eslint-disable-next-line react-refresh/only-export-components
function UserUsernameCell({ row }: { row: Row<User> }) {
  const { setOpen, setCurrentRow } = useUsers()

  return (
    <div style={{ maxWidth: 144 }}>
      <Link
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
        style={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {row.getValue('username')}
      </Link>
    </div>
  )
}

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'mixed')
        }
        onChange={(_, data) =>
          table.toggleAllPageRowsSelected(data.checked === true)
        }
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(_, data) => row.toggleSelected(data.checked === true)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='USERNAME' />
    ),
    cell: ({ row }) => <UserUsernameCell row={row} />,
    enableHiding: false,
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NAME' />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original
      const fullName = `${firstName} ${lastName}`
      return (
        <div style={{ maxWidth: 144 }}>
          <LongText>{fullName}</LongText>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='EMAIL' />
    ),
    cell: ({ row }) => (
      <div style={{ maxWidth: 200 }}>
        <LongText>{row.getValue('email')}</LongText>
      </div>
    ),
    filterFn: (row, id, value) => {
      return String(row.getValue(id))
        .toLowerCase()
        .includes(String(value).toLowerCase())
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PHONE NUMBER' />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='STATUS' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      return (
        <Badge
          appearance='tint'
          color={callTypes.get(status)}
          style={{ textTransform: 'capitalize' }}
        >
          {row.getValue('status')}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ROLE' />
    ),
    cell: ({ row }) => {
      const { role } = row.original
      const userType = roles.find(({ value }) => value === role)

      if (!userType) {
        return null
      }

      const RoleIcon = userType.icon
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacingHorizontalS,
          }}
        >
          <RoleIcon />
          <span style={{ textTransform: 'capitalize' }}>
            {row.getValue('role')}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
