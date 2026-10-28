import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from './tasks-provider'

const useStyles = makeStyles({
  confirmField: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacingVerticalSNudge,
    marginTop: tokens.spacingVerticalL,
  },
})

const CONFIRM_WORD = 'DELETE'

export function TasksDialogs() {
  const styles = useStyles()
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  const [value, setValue] = useState('')
  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null)
        }}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null)
                setValue('')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            handleConfirm={() => {
              if (value.trim() !== CONFIRM_WORD) return
              setOpen(null)
              setValue('')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following task has been deleted:'
              )
            }}
            disabled={value.trim() !== CONFIRM_WORD}
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
                <Label className={styles.confirmField}>
                  <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
                    autoFocus
                  />
                </Label>
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
