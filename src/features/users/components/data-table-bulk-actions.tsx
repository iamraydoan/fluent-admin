import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import {
  Delete20Regular,
  Key20Regular,
  Mail20Regular,
  PersonProhibited20Regular,
  Person20Regular,
  Shield20Regular,
} from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersAssignRoleDialog } from './users-assign-role-dialog'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAssignRole, setShowAssignRole] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = async (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    await sleep(2000)
    toast.success(
      `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} (local only)`
    )
    table.resetRowSelection()
  }

  const handleBulkInvite = async () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    await sleep(2000)
    toast.success(
      `Invited ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} (local only)`
    )
    table.resetRowSelection()
  }

  // Mock behaviour matching the other bulk actions: wait, toast, and
  // clear the selection. No password is actually reset on a server.
  const handleBulkResetPassword = async () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    await sleep(2000)
    toast.success(
      `Reset password for ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} (local only)`
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

        <Tooltip
          content='Reset password for selected users'
          relationship='label'
        >
          <Button
            appearance='secondary'
            size='small'
            shape='square'
            icon={<Key20Regular />}
            onClick={handleBulkResetPassword}
            aria-label='Reset password for selected users'
          />
        </Tooltip>

        <Tooltip content='Assign role to selected users' relationship='label'>
          <Button
            appearance='secondary'
            size='small'
            shape='square'
            icon={<Shield20Regular />}
            onClick={() => setShowAssignRole(true)}
            aria-label='Assign role to selected users'
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

      <UsersAssignRoleDialog
        table={table}
        open={showAssignRole}
        onOpenChange={setShowAssignRole}
      />
    </>
  )
}
