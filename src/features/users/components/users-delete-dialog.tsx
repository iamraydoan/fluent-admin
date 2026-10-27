import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Warning20Regular } from '@fluentui/react-icons'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageBar, MessageBarBody } from '@/components/ui/message-bar'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  text: {
    margin: '0',
  },
  bold: {
    fontWeight: tokens.fontWeightBold,
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

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const styles = useStyles()
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)
    showSubmittedData(currentRow, 'The following user has been deleted:')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='users-delete-form'
      disabled={value.trim() !== currentRow.username}
      title={
        <span className={styles.title}>
          <Warning20Regular /> Delete User
        </span>
      }
      desc={
        <form
          id='users-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className={styles.form}
        >
          <p className={styles.text}>
            Are you sure you want to delete{' '}
            <span className={styles.bold}>{currentRow.username}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className={styles.bold}>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          <div className={styles.confirmField}>
            <Label htmlFor='delete-username'>Username:</Label>
            <Input
              id='delete-username'
              value={value}
              onChange={(_, data) => setValue(data.value)}
              placeholder='Enter username to confirm deletion.'
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
