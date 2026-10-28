import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
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
import { Field } from '@/components/ui/field'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  description: {
    margin: '0',
  },
  previewList: {
    margin: '0',
    paddingLeft: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    maxHeight: '240px',
    overflowY: 'auto',
  },
})

type TasksMassUpdateDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

// Mass Update, not an instant menu action: the user chooses a
// property and a value, previews exactly which tasks change and to
// what, and only then confirms with Update. Closing the dialog
// (including with Escape) leaves the selection untouched.
export function TasksMassUpdateDialog<TData>({
  open,
  onOpenChange,
  table,
}: TasksMassUpdateDialogProps<TData>) {
  const styles = useStyles()
  const [property, setProperty] = useState<'status' | 'priority' | ''>('')
  const [value, setValue] = useState('')
  const [step, setStep] = useState<'choose' | 'preview'>('choose')
  const [busy, setBusy] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedTasks = selectedRows.map((row) => row.original as Task)

  // Fresh state on every open: the parent remounts this dialog
  // (via key) each time it is requested, so closing mid-flow never
  // applies anything and never clears the selection.
  const valueOptions = property === 'status' ? statuses : priorities
  const valueLabel =
    valueOptions.find((option) => option.value === value)?.label ?? value
  const propertyLabel = property === 'status' ? 'Status' : 'Priority'

  const handleUpdate = async () => {
    const count = selectedTasks.length
    setBusy(true)
    await sleep(2000)
    setBusy(false)
    onOpenChange(false)
    table.resetRowSelection()
    toast.success(
      `${propertyLabel} updated to "${valueLabel}" for ${count} task${count > 1 ? 's' : ''} (local only).`
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
            Mass Update
          </DialogTitle>
          <DialogContent>
            {step === 'choose' ? (
              <div className={styles.form}>
                <p className={styles.description}>
                  Update {selectedTasks.length} selected{' '}
                  {selectedTasks.length > 1 ? 'tasks' : 'task'}. Choose a
                  property and a value, then preview the change before it is
                  applied.
                </p>
                <Field label='Property'>
                  {(fieldProps) => (
                    <Select
                      {...fieldProps}
                      value={property}
                      onChange={(_, data) => {
                        setProperty(data.value as 'status' | 'priority')
                        setValue('')
                      }}
                      aria-label='Property'
                    >
                      <option value='' disabled>
                        Select a property
                      </option>
                      <option value='status'>Status</option>
                      <option value='priority'>Priority</option>
                    </Select>
                  )}
                </Field>
                <Field label='Value'>
                  {(fieldProps) => (
                    <Select
                      {...fieldProps}
                      value={value}
                      disabled={!property}
                      onChange={(_, data) => setValue(data.value)}
                      aria-label='Value'
                    >
                      <option value='' disabled>
                        Select a value
                      </option>
                      {valueOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>
            ) : (
              <div className={styles.form}>
                <p className={styles.description}>
                  Preview: {propertyLabel} will be set to{' '}
                  <Text weight='semibold'>{valueLabel}</Text> for{' '}
                  {selectedTasks.length} selected{' '}
                  {selectedTasks.length > 1 ? 'tasks' : 'task'}. This is a local
                  action only.
                </p>
                <ul className={styles.previewList}>
                  {selectedTasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            {step === 'choose' ? (
              <>
                <DialogTrigger action='close'>
                  <Button appearance='secondary'>Cancel</Button>
                </DialogTrigger>
                <Button
                  appearance='primary'
                  disabled={!property || !value}
                  onClick={() => setStep('preview')}
                >
                  Preview
                </Button>
              </>
            ) : (
              <>
                <Button
                  appearance='secondary'
                  disabled={busy}
                  onClick={() => setStep('choose')}
                >
                  Back
                </Button>
                <Button
                  appearance='primary'
                  disabled={busy}
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
