import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
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
  passwordBlock: {
    position: 'relative',
  },
  passwordField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  forgotLink: {
    position: 'absolute',
    right: '0px',
    top: '0px',
    fontSize: '14px',
    fontWeight: 500,
    color: tokens.colorNeutralForeground2,
    textDecoration: 'none',
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
    whiteSpace: 'nowrap',
    flexShrink: 0,
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

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({ redirectTo, ...props }: UserAuthFormProps) {
  const styles = useStyles()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    void sleep(2000).then(() => {
      setIsLoading(false)

      // Mock successful authentication with expiry computed at success time
      const mockUser = {
        accountNo: 'ACC001',
        email: data.email,
        role: ['user'],
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
      }

      // Set user and access token
      auth.setUser(mockUser)
      auth.setAccessToken('mock-access-token')

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })

      toast.success(`Welcome back, ${data.email}!`)
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
          <div className={styles.passwordBlock}>
            <div className={styles.passwordField}>
              <Label htmlFor='password'>Password</Label>
              <PasswordInput
                id='password'
                placeholder='********'
                {...fieldProps}
                ref={ref}
              />
              {fieldState.error ? (
                <Text size={200} className={styles.error}>
                  {fieldState.error.message}
                </Text>
              ) : null}
            </div>
            <Link to='/forgot-password' className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
        )}
      />
      <Button
        appearance='primary'
        type='submit'
        disabled={isLoading}
        className={styles.submit}
      >
        {isLoading ? <Spinner size='tiny' /> : null}
        Sign in
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
