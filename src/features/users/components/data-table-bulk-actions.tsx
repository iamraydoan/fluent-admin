import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import {
  Delete20Regular,
  Mail20Regular,
  PersonProhibited20Regular,
  Person20Regular,
} from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = async (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    await sleep(2000)
    toast.success(
      `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
    )
    table.resetRowSelection()
  }

  const handleBulkInvite = async () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    await sleep(2000)
    toast.success(
      `Invited ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
    )
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip content='Invite selected users' relationship='label'>
          <Button
            appearance='secondary'
            size='small'
            shape='square'
            icon={<Mail20Regular />}
            onClick={handleBulkInvite}
            aria-label='Invite selected users'
          />
        </Tooltip>

        <Tooltip content='Activate selected users' relationship='label'>
          <Button
            appearance='secondary'
            size='small'
            shape='square'
            icon={<Person20Regular />}
            onClick={() => handleBulkStatusChange('active')}
            aria-label='Activate selected users'
          />
        </Tooltip>

        <Tooltip content='Deactivate selected users' relationship='label'>
          <Button
            appearance='secondary'
            size='small'
            shape='square'
            icon={<PersonProhibited20Regular />}
            onClick={() => handleBulkStatusChange('inactive')}
            aria-label='Deactivate selected users'
          />
        </Tooltip>

        <Tooltip content='Delete selected users' relationship='label'>
          <Button
            appearance='secondary'
            size='small'
            shape='square'
            icon={<Delete20Regular />}
            onClick={() => setShowDeleteConfirm(true)}
            aria-label='Delete selected users'
          />
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
