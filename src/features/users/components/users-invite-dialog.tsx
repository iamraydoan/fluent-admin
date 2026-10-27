import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles } from '@fluentui/react-components'
import {
  Dismiss20Regular,
  MailAdd20Regular,
  Send20Regular,
} from '@fluentui/react-icons'
import { showSubmittedData } from '@/lib/show-submitted-data'
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
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { roles } from '../data/data'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  description: {
    margin: '0',
  },
  titleIcon: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    marginRight: '8px',
  },
})

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Please enter an email to invite.' : undefined,
  }),
  role: z.string().min(1, 'Role is required.'),
  desc: z.string().optional(),
})

type UserInviteForm = z.infer<typeof formSchema>

type UserInviteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({
  open,
  onOpenChange,
}: UserInviteDialogProps) {
  const styles = useStyles()
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', role: '', desc: '' },
  })

  const onSubmit = (values: UserInviteForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  const { control, formState } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        form.reset()
        onOpenChange(data.open)
      }}
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
            <span className={styles.titleIcon}>
              <MailAdd20Regular />
            </span>
            Invite User
          </DialogTitle>
          <DialogContent>
            <p className={styles.description}>
              Invite new user to join your team by sending them an email
              invitation. Assign a role to define their access level.
            </p>
            <form
              id='user-invite-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className={styles.form}
            >
              <Field
                label='Email'
                validationMessage={formState.errors.email?.message}
              >
                {(fieldProps) => (
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...fieldProps}
                        name={field.name}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={(_, data) => field.onChange(data.value)}
                        type='email'
                        placeholder='eg: john.doe@gmail.com'
                      />
                    )}
                  />
                )}
              </Field>
              <Field
                label='Role'
                validationMessage={formState.errors.role?.message}
              >
                {(fieldProps) => (
                  <Controller
                    name='role'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...fieldProps}
                        value={field.value}
                        onBlur={field.onBlur}
                        onChange={(_, data) => field.onChange(data.value)}
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
                  />
                )}
              </Field>
              <Field
                label='Description (optional)'
                validationMessage={formState.errors.desc?.message}
              >
                {(fieldProps) => (
                  <Controller
                    name='desc'
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...fieldProps}
                        name={field.name}
                        value={field.value ?? ''}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        placeholder='Add a personal note to your invitation (optional)'
                      />
                    )}
                  />
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
              form='user-invite-form'
              appearance='primary'
              icon={<Send20Regular />}
            >
              Invite
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
