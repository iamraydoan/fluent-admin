import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  Dismiss20Regular,
  MailAdd20Regular,
  Send20Regular,
} from '@fluentui/react-icons'
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
    gap: tokens.spacingVerticalL,
  },
  description: {
    margin: '0',
  },
  titleIcon: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    marginRight: tokens.spacingHorizontalS,
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

  // Dirty wiring only (tab guard): same pattern as
  // UsersActionDialog — mirror isDirty onto the tab that owned
  // this form when it OPENED (captured in ownedTabUrlRef) while
  // open; save success and dialog close reset the form and clear
  // the flag. The flag must NOT follow the live activeUrl: during
  // a confirmed tab close the store already switches activeUrl to
  // the fallback tab while this form is still mounted (close
  // transition), so re-marking against the then-current activeUrl
  // would leak the dirty flag onto the fallback tab. The mirror
  // effect therefore has no activeUrl dependency, and its cleanup
  // clears the owned tab on unmount. The flag is per-tab, shared
  // with the Action dialog on the same tab (never open at once,
  // modal).
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
            Invite
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
