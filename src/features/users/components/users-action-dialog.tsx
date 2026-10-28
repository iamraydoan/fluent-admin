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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PasswordInput } from '@/components/password-input'
import { accountTypes, departments, roles } from '../data/data'
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

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    department: z.string().min(1, 'Department is required.'),
    jobTitle: z.string().min(1, 'Job Title is required.'),
    manager: z.string(),
    accountType: z.string().min(1, 'Account Type is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Password must be at least 8 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: 'Password must contain at least one lowercase letter.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: 'Password must contain at least one number.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TextFieldName =
  | 'firstName'
  | 'lastName'
  | 'username'
  | 'email'
  | 'phoneNumber'
  | 'jobTitle'
  | 'manager'

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const styles = useStyles()
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          department: '',
          jobTitle: '',
          manager: '',
          accountType: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const onSubmit = (values: UserForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  // Dirty wiring only (tab guard): while this dialog is open,
  // mirror react-hook-form's isDirty onto the tab that owned
  // this form when it OPENED (captured in ownedTabUrlRef), so
  // closing the tab prompts first. The flag must NOT follow the
  // live activeUrl: during a confirmed tab close the store
  // already switches activeUrl to the fallback tab while this
  // form is still mounted (close transition), so re-marking
  // against the then-current activeUrl would leak the dirty flag
  // onto the fallback tab. The mirror effect therefore has no
  // activeUrl dependency, and its cleanup clears the owned tab
  // on unmount, so a closing form can never mark the fallback
  // tab dirty. Save success and dialog close both reset the
  // form (see onSubmit and the Dialog onOpenChange below), which
  // clears isDirty and therefore the tab flag; the closed branch
  // below also clears it explicitly. The flag is per-tab, not
  // per-dialog, so it is shared with the Invite dialog on the
  // same tab (the two dialogs are never open at once, as each is
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

  // Dialog-level dirty guard (D1): every close attempt (X, Cancel,
  // backdrop click, Escape) arrives here as Dialog onOpenChange
  // false. While the form is dirty the attempt only opens the
  // confirm prompt: the parent onOpenChange is NOT called and the
  // form is NOT reset, so Keep editing returns to the form with
  // its dirty values intact. Discard resets the form and then
  // closes. A clean form closes immediately, exactly as before.
  // Save bypasses this entirely (onSubmit, not a close attempt).
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
  // Parent-driven close (open prop flipped without a Dialog close
  // event) must also leave a clean form for the next open. The
  // prompt itself needs no state sync: its open prop below is
  // `confirmOpen && open`, so it hides with the main dialog.
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const isPasswordTouched = !!form.formState.dirtyFields.password
  const { control, formState } = form

  const textField = (
    name: TextFieldName,
    label: string,
    placeholder: string
  ) => (
    <Field label={label} validationMessage={formState.errors[name]?.message}>
      {(fieldProps) => (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...fieldProps}
              name={field.name}
              value={field.value}
              onBlur={field.onBlur}
              onChange={(_, data) => field.onChange(data.value)}
              placeholder={placeholder}
              autoComplete='off'
            />
          )}
        />
      )}
    </Field>
  )

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(_, data) => {
          if (data.open) return
          requestClose()
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
              {isEdit ? 'Edit' : 'Add'}
            </DialogTitle>
            <DialogContent>
              <p className={styles.description}>
                {isEdit ? 'Update the user here. ' : 'Create new user here. '}
                Click save when you&apos;re done.
              </p>
              <form
                id='user-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className={styles.form}
              >
                {textField('firstName', 'First Name', 'John')}
                {textField('lastName', 'Last Name', 'Doe')}
                {textField('username', 'Username', 'john_doe')}
                {textField('email', 'Email', 'john.doe@gmail.com')}
                {textField('phoneNumber', 'Phone Number', '+123456789')}
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
                  label='Department'
                  validationMessage={formState.errors.department?.message}
                >
                  {(fieldProps) => (
                    <Controller
                      name='department'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...fieldProps}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(_, data) => field.onChange(data.value)}
                        >
                          <option value='' disabled>
                            Select a department
                          </option>
                          {departments.map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                  )}
                </Field>
                {textField('jobTitle', 'Job Title', 'Software Engineer')}
                {textField('manager', 'Manager', 'Jane Smith')}
                <Field
                  label='Account Type'
                  validationMessage={formState.errors.accountType?.message}
                >
                  {(fieldProps) => (
                    <Controller
                      name='accountType'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...fieldProps}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(_, data) => field.onChange(data.value)}
                        >
                          <option value='' disabled>
                            Select an account type
                          </option>
                          {accountTypes.map(({ label, value }) => (
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
                  label='Password'
                  validationMessage={formState.errors.password?.message}
                >
                  {(fieldProps) => (
                    <Controller
                      name='password'
                      control={control}
                      render={({ field }) => (
                        <PasswordInput
                          {...fieldProps}
                          name={field.name}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          placeholder='e.g., S3cur3P@ssw0rd'
                        />
                      )}
                    />
                  )}
                </Field>
                <Field
                  label='Confirm Password'
                  validationMessage={formState.errors.confirmPassword?.message}
                >
                  {(fieldProps) => (
                    <Controller
                      name='confirmPassword'
                      control={control}
                      render={({ field }) => (
                        <PasswordInput
                          {...fieldProps}
                          name={field.name}
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          disabled={!isPasswordTouched}
                          placeholder='e.g., S3cur3P@ssw0rd'
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
              <Button type='submit' form='user-form' appearance='primary'>
                Save changes
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
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
              <p className={styles.description}>
                You have unsaved changes. Discarding closes without saving.
              </p>
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
