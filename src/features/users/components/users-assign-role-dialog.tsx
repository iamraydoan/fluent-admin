import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
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
import { Field } from '@/components/ui/field'
import { Select } from '@/components/ui/select'
import { roles } from '../data/data'
import { type User } from '../data/schema'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  description: {
    margin: '0',
  },
})

type UsersAssignRoleDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

// Real dialog (not a mock API call): choosing a role and confirming
// only shows a confirmation toast and clears the selection. The
// assignment is not persisted to any server.
export function UsersAssignRoleDialog<TData>({
  open,
  onOpenChange,
  table,
}: UsersAssignRoleDialogProps<TData>) {
  const styles = useStyles()
  const [role, setRole] = useState('')
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleConfirm = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    const roleLabel = roles.find(({ value }) => value === role)?.label ?? role
    onOpenChange(false)
    setRole('')
    table.resetRowSelection()
    toast.success(
      `Assigned role ${roleLabel} to ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''} (local only)`
    )
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
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
            Assign Role
          </DialogTitle>
          <DialogContent>
            <p className={styles.description}>
              Assign a role to the {selectedRows.length} selected{' '}
              {selectedRows.length > 1 ? 'users' : 'user'}. This is a
              configuration action only and is not saved to a server.
            </p>
            <form
              id='users-assign-role-form'
              onSubmit={(event) => {
                event.preventDefault()
                handleConfirm()
              }}
              className={styles.form}
            >
              <Field label='Role'>
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    value={role}
                    onChange={(_, data) => setRole(data.value)}
                  >
                    <option value='' disabled>
                      Select a role
                    </option>
                    {roles.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </form>
          </DialogContent>
          <DialogActions>
            <DialogTrigger action='close'>
              <Button appearance='secondary'>Cancel</Button>
            </DialogTrigger>
            <Button
              type='submit'
              form='users-assign-role-form'
              appearance='primary'
              disabled={!role}
            >
              Assign
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
