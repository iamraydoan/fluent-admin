import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXXL,
  },
})

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(30, 'Name must not be longer than 30 characters.'),
  dob: z.string().min(1, 'Please select your date of birth.'),
  language: z.string('Please select a language.'),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
}

export function AccountForm() {
  const styles = useStyles()
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        control={form.control}
        name='name'
        render={({ field, fieldState }) => (
          <Field
            label='Name'
            hint='This is the name that will be displayed on your profile and in emails.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <Input
              placeholder='Your name'
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name='dob'
        render={({ field, fieldState }) => (
          <Field
            label='Date of birth'
            hint='Your date of birth is used to calculate your age.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <Input
              type='date'
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name='language'
        render={({ field, fieldState }) => (
          <Field
            label='Language'
            hint='This is the language that will be used in the dashboard.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <Select
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            >
              <option value='' disabled>
                Select language
              </option>
              {languages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </Select>
          </Field>
        )}
      />
      <div>
        <Button type='submit' appearance='primary'>
          Update account
        </Button>
      </div>
    </form>
  )
}
