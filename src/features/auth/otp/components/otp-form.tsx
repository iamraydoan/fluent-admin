import { useState } from 'react'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { toast } from '@/lib/toast'
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
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ ...props }: OtpFormProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const otp = form.watch('otp')

  function onSubmit() {
    setIsLoading(true)
    toast.success('Verification code submitted.')

    setTimeout(() => {
      setIsLoading(false)
      navigate({ to: '/' })
    }, 1000)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={styles.form}
      {...props}
    >
      <Controller
        control={form.control}
        name='otp'
        render={({ field, fieldState }) => (
          <Field
            label='One-Time Password'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : undefined}
          >
            <Input
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
        disabled={otp.length < 6 || isLoading}
        className={styles.submit}
      >
        {isLoading ? <Spinner size='tiny' /> : null}
        Verify
      </Button>
    </form>
  )
}
