import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
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
import { roles } from '../data/data'
import { type User } from '../data/schema'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  'firstName' | 'lastName' | 'username' | 'email' | 'phoneNumber'

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
            {isEdit ? 'Edit User' : 'Add New User'}
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
  )
}
