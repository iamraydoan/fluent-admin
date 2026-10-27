import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { toast } from '@/lib/toast'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/text'
import { PasswordInput } from '@/components/password-input'

const useStyles = makeStyles({
  form: {
    display: 'grid',
    gap: '12px',
  },
  passwordField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
  },
  submit: {
    marginTop: '8px',
    width: '100%',
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
    marginBottom: '8px',
  },
  dividerLine: {
    flexGrow: 1,
  },
  dividerLabel: {
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
  },
  socialRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  socialButton: {
    width: '100%',
  },
})

const formSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Please enter your email.' : undefined,
    }),
    password: z
      .string()
      .min(1, 'Please enter your password.')
      .min(7, 'Password must be at least 7 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

function PasswordField({
  id,
  label,
  fieldProps,
  fieldRef,
  error,
}: {
  id: string
  label: string
  fieldProps: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'ref'
  > & { name: string }
  fieldRef: React.Ref<HTMLInputElement>
  error?: string
}) {
  const styles = useStyles()
  return (
    <div className={styles.passwordField}>
      <Label htmlFor={id}>{label}</Label>
      <PasswordInput
        id={id}
        placeholder='********'
        {...fieldProps}
        ref={fieldRef}
      />
      {error ? (
        <Text size={200} className={styles.error}>
          {error}
        </Text>
      ) : null}
    </div>
  )
}

export function SignUpForm({
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const styles = useStyles()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    void sleep(2000).then(() => {
      setIsLoading(false)
      toast.success(`Account created for ${data.email}.`)
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={styles.form}
      {...props}
    >
      <Controller
        control={form.control}
        name='email'
        render={({ field, fieldState }) => (
          <Field
            label='Email'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : undefined}
          >
            <Input
              placeholder='name@example.com'
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name='password'
        render={({ field: { ref, ...fieldProps }, fieldState }) => (
          <PasswordField
            id='password'
            label='Password'
            fieldProps={fieldProps}
            fieldRef={ref}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name='confirmPassword'
        render={({ field: { ref, ...fieldProps }, fieldState }) => (
          <PasswordField
            id='confirmPassword'
            label='Confirm Password'
            fieldProps={fieldProps}
            fieldRef={ref}
            error={fieldState.error?.message}
          />
        )}
      />
      <Button
        appearance='primary'
        type='submit'
        disabled={isLoading}
        className={styles.submit}
      >
        {isLoading ? <Spinner size='tiny' /> : null}
        Create Account
      </Button>

      <div className={styles.dividerRow}>
        <Divider className={styles.dividerLine} />
        <Text size={200} className={styles.dividerLabel}>
          Or continue with
        </Text>
        <Divider className={styles.dividerLine} />
      </div>

      <div className={styles.socialRow}>
        <Button
          appearance='outline'
          type='button'
          disabled={isLoading}
          className={styles.socialButton}
          icon={<IconGithub style={{ width: 20, height: 20 }} />}
        >
          GitHub
        </Button>
        <Button
          appearance='outline'
          type='button'
          disabled={isLoading}
          className={styles.socialButton}
          icon={<IconFacebook style={{ width: 20, height: 20 }} />}
        >
          Facebook
        </Button>
      </div>
    </form>
  )
}
