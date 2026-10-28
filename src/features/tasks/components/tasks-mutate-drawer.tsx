import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { useShellStore } from '@/stores/shell-store'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Radio, RadioGroup } from '@/components/ui/radio-group'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'
import { type Task } from '../data/schema'

const useStyles = makeStyles({
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
  },
  title: {
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
  },
})

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  status: z.string().min(1, 'Please select a status.'),
  label: z.string().min(1, 'Please select a label.'),
  priority: z.string().min(1, 'Please choose a priority.'),
})
type TaskForm = z.infer<typeof formSchema>

const statusOptions = [
  { label: 'In Progress', value: 'in progress' },
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Done', value: 'done' },
]

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const styles = useStyles()
  const isUpdate = !!currentRow

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
  })

  const onSubmit = (data: TaskForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
  }

  // Dirty wiring only (tab guard): mirror react-hook-form's
  // isDirty onto the tab that owned this form when it OPENED
  // (captured in ownedTabUrlRef), so closing the tab prompts
  // first. The flag must NOT follow the live activeUrl: during a
  // confirmed tab close the store already switches activeUrl to
  // the fallback tab while this form is still mounted (close
  // transition), so re-marking against the then-current activeUrl
  // would leak the dirty flag onto the fallback tab. The mirror
  // effect therefore has no activeUrl dependency, and its cleanup
  // clears the owned tab on unmount, so a closing form can never
  // mark the fallback tab dirty. Save success and drawer close
  // both reset the form (see onSubmit and the Drawer onOpenChange
  // below), which clears isDirty and therefore the tab flag; the
  // closed branch below also clears it explicitly.
  const activeTabUrl = useShellStore((state) => state.activeUrl)
  const markDirty = useShellStore((state) => state.markDirty)
  const clearDirty = useShellStore((state) => state.clearDirty)
  const isFormDirty = form.formState.isDirty
  const ownedTabUrlRef = useRef<string | null>(null)
  useEffect(() => {
    if (open) {
      if (ownedTabUrlRef.current === null && activeTabUrl) {
        ownedTabUrlRef.current = activeTabUrl
      }
    } else {
      ownedTabUrlRef.current = null
    }
  }, [open, activeTabUrl])
  useEffect(() => {
    const ownedTabUrl = ownedTabUrlRef.current
    if (!open) {
      if (ownedTabUrl) clearDirty(ownedTabUrl)
      return
    }
    if (!ownedTabUrl) return
    if (isFormDirty) markDirty(ownedTabUrl)
    else clearDirty(ownedTabUrl)
    return () => {
      clearDirty(ownedTabUrl)
    }
  }, [open, isFormDirty, markDirty, clearDirty])

  // Drawer-level dirty guard (D1): every close attempt (header X,
  // footer Close, backdrop click, Escape) goes through
  // requestClose. While the form is dirty the attempt only opens
  // the confirm prompt: the parent onOpenChange is NOT called and
  // the form is NOT reset, so Keep editing returns to the form
  // with its dirty values intact. Discard resets the form and
  // then closes. A clean form closes immediately, exactly as
  // before. Save bypasses this entirely (onSubmit, not a close
  // attempt).
  const [confirmOpen, setConfirmOpen] = useState(false)
  const requestClose = () => {
    if (isFormDirty) {
      setConfirmOpen(true)
      return
    }
    form.reset()
    onOpenChange(false)
  }
  const discardChanges = () => {
    setConfirmOpen(false)
    form.reset()
    onOpenChange(false)
  }
  // Parent-driven close (open prop flipped without a Drawer close
  // event) must also leave a clean form for the next open. The
  // prompt itself needs no state sync: its open prop below is
  // `confirmOpen && open`, so it hides with the drawer.
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(_, data) => {
          if (data.open) return
          requestClose()
        }}
      >
        <DrawerHeader>
          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.title}>{isUpdate ? 'Update' : 'Create'}</h2>
              <Text>
                {isUpdate
                  ? 'Update the task by providing necessary info.'
                  : 'Add a new task by providing necessary info.'}{' '}
                Click save when you&apos;re done.
              </Text>
            </div>
            <Tooltip content='Close' relationship='label'>
              <Button
                appearance='subtle'
                size='small'
                icon={<Dismiss20Regular />}
                aria-label='Close'
                onClick={requestClose}
              />
            </Tooltip>
          </div>
        </DrawerHeader>
        <DrawerBody>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className={styles.form}
          >
            <Controller
              control={form.control}
              name='title'
              render={({ field, fieldState }) => (
                <Field
                  label='Title'
                  validationMessage={fieldState.error?.message}
                >
                  <Input {...field} placeholder='Enter a title' />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='status'
              render={({ field, fieldState }) => (
                <Field
                  label='Status'
                  validationMessage={fieldState.error?.message}
                >
                  <Select
                    value={field.value}
                    onChange={(_, data) => field.onChange(data.value)}
                    onBlur={field.onBlur}
                  >
                    <option value='' disabled>
                      Select a status
                    </option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='label'
              render={({ field, fieldState }) => (
                <Field
                  label='Label'
                  validationMessage={fieldState.error?.message}
                >
                  <RadioGroup
                    value={field.value}
                    onChange={(_, data) => field.onChange(data.value)}
                    className={styles.radioGroup}
                  >
                    <Radio value='documentation' label='Documentation' />
                    <Radio value='feature' label='Feature' />
                    <Radio value='bug' label='Bug' />
                  </RadioGroup>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='priority'
              render={({ field, fieldState }) => (
                <Field
                  label='Priority'
                  validationMessage={fieldState.error?.message}
                >
                  <RadioGroup
                    value={field.value}
                    onChange={(_, data) => field.onChange(data.value)}
                    className={styles.radioGroup}
                  >
                    <Radio value='high' label='High' />
                    <Radio value='medium' label='Medium' />
                    <Radio value='low' label='Low' />
                  </RadioGroup>
                </Field>
              )}
            />
          </form>
        </DrawerBody>
        <DrawerFooter>
          <div className={styles.footer}>
            <Button appearance='secondary' onClick={requestClose}>
              Close
            </Button>
            <Button appearance='primary' form='tasks-form' type='submit'>
              Save changes
            </Button>
          </div>
        </DrawerFooter>
      </Drawer>
      <Dialog
        open={confirmOpen && open}
        onOpenChange={(_, data) => {
          if (!data.open) setConfirmOpen(false)
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogContent>
              <p>You have unsaved changes. Discarding closes without saving.</p>
            </DialogContent>
            <DialogActions>
              <Button
                appearance='secondary'
                onClick={() => setConfirmOpen(false)}
              >
                Keep editing
              </Button>
              <Button appearance='primary' onClick={discardChanges}>
                Discard changes
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
