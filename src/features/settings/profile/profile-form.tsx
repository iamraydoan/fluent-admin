import { z } from 'zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  urls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  urlRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  addButton: {
    marginTop: '8px',
  },
})

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? 'Please select an email to display.'
        : undefined,
  }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url('Please enter a valid URL.'),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
}

export function ProfileForm() {
  const styles = useStyles()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  return (
    <form
      onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
      className={styles.form}
    >
      <Controller
        control={form.control}
        name='username'
        render={({ field, fieldState }) => (
          <Field
            label='Username'
            hint='This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <Input
              placeholder='shadcn'
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name='email'
        render={({ field, fieldState }) => (
          <Field
            label='Email'
            hint={
              <>
                You can manage verified email addresses in your{' '}
                <Link to='/'>email settings</Link>.
              </>
            }
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <Select
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            >
              <option value='' disabled>
                Select a verified email to display
              </option>
              <option value='m@example.com'>m@example.com</option>
              <option value='m@google.com'>m@google.com</option>
              <option value='m@support.com'>m@support.com</option>
            </Select>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name='bio'
        render={({ field, fieldState }) => (
          <Field
            label='Bio'
            hint='You can @mention other users and organizations to link to them.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <Textarea
              placeholder='Tell us a little bit about yourself'
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
            />
          </Field>
        )}
      />
      <div className={styles.urls}>
        <Text size={400} weight='semibold'>
          URLs
        </Text>
        <Text size={300}>
          Add links to your website, blog, or social media profiles.
        </Text>
        {fields.map((item, index) => (
          <Controller
            key={item.id}
            control={form.control}
            name={`urls.${index}.value`}
            render={({ field, fieldState }) => (
              <div className={styles.urlRow}>
                <Field
                  validationMessage={fieldState.error?.message}
                  validationState={fieldState.error ? 'error' : 'none'}
                >
                  <Input
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                  />
                </Field>
              </div>
            )}
          />
        ))}
        <div className={styles.addButton}>
          <Button
            type='button'
            appearance='secondary'
            size='small'
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button>
        </div>
      </div>
      <div>
        <Button type='submit'>Update profile</Button>
      </div>
    </form>
  )
}
