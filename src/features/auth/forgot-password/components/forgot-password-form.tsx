import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ArrowRight20Regular } from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

const useStyles = makeStyles({
  form: {
    display: 'grid',
    gap: tokens.spacingHorizontalS,
  },
  submit: {
    marginTop: tokens.spacingVerticalS,
    width: '100%',
  },
})

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
})

export function ForgotPasswordForm({
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    void sleep(2000).then(() => {
      setIsLoading(false)
      form.reset()
      navigate({ to: '/otp' })
      toast.success(`Email sent to ${data.email}`)
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
      <Button
        appearance='primary'
        type='submit'
        disabled={isLoading}
        className={styles.submit}
        icon={isLoading ? <Spinner size='tiny' /> : <ArrowRight20Regular />}
      >
        Continue
      </Button>
    </form>
  )
}
