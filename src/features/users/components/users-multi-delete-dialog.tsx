import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Warning20Regular } from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { sleep } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageBar, MessageBarBody } from '@/components/ui/message-bar'
import { ConfirmDialog } from '@/components/confirm-dialog'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  text: {
    margin: '0',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  confirmField: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
})

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const styles = useStyles()
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    onOpenChange(false)

    await sleep(2000)
    setValue('')
    table.resetRowSelection()
    toast.success(
      `Deleted ${selectedRows.length} ${selectedRows.length > 1 ? 'users' : 'user'} (local only)`
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='users-multi-delete-form'
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className={styles.title}>
          <Warning20Regular /> Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <form
          id='users-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className={styles.form}
        >
          <p className={styles.text}>
            Are you sure you want to delete the selected users? <br />
            This action cannot be undone.
          </p>

          <div className={styles.confirmField}>
            <Label htmlFor='multi-delete-confirm'>
              Confirm by typing &quot;{CONFIRM_WORD}&quot;:
            </Label>
            <Input
              id='multi-delete-confirm'
              value={value}
              onChange={(_, data) => setValue(data.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              autoFocus
            />
          </div>

          <MessageBar intent='error'>
            <MessageBarBody>
              Warning! Please be careful, this operation can not be rolled back.
            </MessageBarBody>
          </MessageBar>
        </form>
      }
      confirmText='Delete'
      destructive
    />
  )
}
