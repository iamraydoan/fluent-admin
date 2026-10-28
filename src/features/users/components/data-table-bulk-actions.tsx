import { useEffect, useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { makeStyles } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { formatPhone } from '@/lib/format'
import { toast } from '@/lib/toast'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { downloadCsv, type CsvColumn } from '@/components/data-table'
import { accountTypes, roles } from '../data/data'
import { type User } from '../data/schema'
import { UsersAssignRoleDialog } from './users-assign-role-dialog'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

const useStyles = makeStyles({
  description: {
    margin: '0',
  },
})

// Bulk actions live in the screen ActionBar, not in a floating
// toolbar: this component owns only the dialogs and the action
// handlers, and reports a controller to the screen through
// onBulkChange. The screen renders the ActionBar buttons from it
// (disabled at 0 selected, enabled above 0). There is deliberately
// no key handler here: pressing Escape must never clear the
// selection — it only closes a menu or dialog (Fluent's own
// behaviour), leaving the selection intact.
export type UsersBulkController = {
  selectedCount: number
  busyAction: string | null
  invite: () => void
  activate: () => void
  deactivate: () => void
  requestResetPassword: () => void
  requestAssignRole: () => void
  requestDelete: () => void
  exportCsv: () => void
}

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
  onBulkChange?: (controller: UsersBulkController) => void
}

export function DataTableBulkActions<TData>({
  table,
  onBulkChange,
}: DataTableBulkActionsProps<TData>) {
  const styles = useStyles()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAssignRole, setShowAssignRole] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  // Selection identity, not just the count: swapping one selected
  // row for another keeps the count but must refresh the
  // controller's handlers, otherwise they would act on stale rows.
  const selectionKey = selectedRows.map((row) => row.id).join(',')
  const visibleKey = table
    .getVisibleLeafColumns()
    .map((column) => column.id)
    .join(',')

  const runBulkAction = async (action: string, message: string) => {
    const count = selectedRows.length
    setBusyAction(action)
    await sleep(2000)
    setBusyAction(null)
    table.resetRowSelection()
    toast.success(message.replace('{count}', `${count}`))
  }

  const handleBulkStatusChange = (status: 'active' | 'inactive') =>
    runBulkAction(
      status,
      `${status === 'active' ? 'Activated' : 'Deactivated'} {count} user${selectedCount > 1 ? 's' : ''} (local only)`
    )

  const handleBulkInvite = () =>
    runBulkAction(
      'invite',
      `Invited {count} user${selectedCount > 1 ? 's' : ''} (local only)`
    )

  const handleResetPasswordConfirm = () => {
    setShowResetConfirm(false)
    void runBulkAction(
      'reset-password',
      `Reset password for {count} user${selectedCount > 1 ? 's' : ''} (local only)`
    )
  }

  const handleExportCsv = () => {
    const rows = table.getFilteredRowModel().rows
    const isVisible = (id: string) =>
      table.getColumn(id)?.getIsVisible() ?? false
    const all: { id: string; title: string; values: string[] }[] = [
      {
        id: 'username',
        title: 'USERNAME',
        values: rows.map((row) => (row.original as User).username),
      },
      {
        id: 'fullName',
        title: 'NAME',
        values: rows.map(
          (row) =>
            `${(row.original as User).firstName} ${(row.original as User).lastName}`
        ),
      },
      {
        id: 'email',
        title: 'EMAIL',
        values: rows.map((row) => (row.original as User).email),
      },
      {
        id: 'phoneNumber',
        title: 'PHONE NUMBER',
        values: rows.map((row) =>
          formatPhone((row.original as User).phoneNumber)
        ),
      },
      {
        id: 'status',
        title: 'STATUS',
        values: rows.map((row) => (row.original as User).status),
      },
      {
        id: 'role',
        title: 'ROLE',
        values: rows.map((row) => {
          const role = roles.find(
            ({ value }) => value === (row.original as User).role
          )
          return role ? role.label : (row.original as User).role
        }),
      },
      {
        id: 'department',
        title: 'DEPARTMENT',
        values: rows.map((row) => (row.original as User).department),
      },
      {
        id: 'jobTitle',
        title: 'JOB TITLE',
        values: rows.map((row) => (row.original as User).jobTitle),
      },
      {
        id: 'manager',
        title: 'MANAGER',
        values: rows.map((row) => (row.original as User).manager),
      },
      {
        id: 'accountType',
        title: 'ACCOUNT TYPE',
        values: rows.map((row) => {
          const accountType = accountTypes.find(
            ({ value }) => value === (row.original as User).accountType
          )
          return accountType
            ? accountType.label
            : (row.original as User).accountType
        }),
      },
    ]
    // Visible columns only; the selection and row-actions columns
    // are never exported (they are not in this list at all).
    const columns: CsvColumn[] = all.filter((column) => isVisible(column.id))
    const count = downloadCsv('users.csv', columns)
    toast.success(`Exported ${count} users to CSV`)
  }

  // Report the controller after every render that changes the
  // selection, the busy action, or column visibility, so the
  // ActionBar buttons always act on the current selection.
  useEffect(() => {
    onBulkChange?.({
      selectedCount,
      busyAction,
      invite: handleBulkInvite,
      activate: () => handleBulkStatusChange('active'),
      deactivate: () => handleBulkStatusChange('inactive'),
      requestResetPassword: () => setShowResetConfirm(true),
      requestAssignRole: () => setShowAssignRole(true),
      requestDelete: () => setShowDeleteConfirm(true),
      exportCsv: handleExportCsv,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionKey, busyAction, visibleKey])

  return (
    <>
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

      <Dialog
        open={showResetConfirm}
        onOpenChange={(_, data) => setShowResetConfirm(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action='close'>
                  <Button
                    appearance='subtle'
                    shape='square'
                    size='small'
                    icon={<Dismiss20Regular />}
                    aria-label='Close'
                  />
                </DialogTrigger>
              }
            >
              Reset password
            </DialogTitle>
            <DialogContent>
              <p className={styles.description}>
                Reset the password for {selectedCount} selected{' '}
                {selectedCount > 1 ? 'users' : 'user'}? This is a local action
                only and no password is actually changed on a server.
              </p>
            </DialogContent>
            <DialogActions>
              <DialogTrigger action='close'>
                <Button appearance='secondary'>Cancel</Button>
              </DialogTrigger>
              <Button
                appearance='primary'
                disabled={busyAction === 'reset-password'}
                onClick={handleResetPasswordConfirm}
              >
                Reset password
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
