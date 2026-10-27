import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
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
import { type Task } from '../data/schema'

const useStyles = makeStyles({
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
  },
  title: {
    margin: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
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

  return (
    <Drawer
      open={open}
      onOpenChange={(_, data) => {
        onOpenChange(data.open)
        if (!data.open) {
          form.reset()
        }
      }}
    >
      <DrawerHeader>
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>
              {isUpdate ? 'Update' : 'Create'} Task
            </h2>
            <Text>
              {isUpdate
                ? 'Update the task by providing necessary info.'
                : 'Add a new task by providing necessary info.'}{' '}
              Click save when you&apos;re done.
            </Text>
          </div>
          <Button
            appearance='subtle'
            size='small'
            icon={<Dismiss20Regular />}
            aria-label='Close'
            onClick={() => onOpenChange(false)}
          />
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
          <Button appearance='secondary' onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button appearance='primary' form='tasks-form' type='submit'>
            Save changes
          </Button>
        </div>
      </DrawerFooter>
    </Drawer>
  )
}
