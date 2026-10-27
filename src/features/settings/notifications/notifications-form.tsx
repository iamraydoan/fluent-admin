import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Radio, RadioGroup } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXXL,
  },
  radios: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  emailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  emailTitle: {
    display: 'block',
    marginBottom: tokens.spacingVerticalXS,
  },
  emailList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  emailRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalL,
    // Nearest stroke token to #edebe9: Stroke2 #e0e0e0 (see header.tsx).
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    boxSizing: 'border-box',
  },
  emailText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  mobileRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
  },
  mobileText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
})

const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    error: (iss) =>
      iss.input === undefined
        ? 'Please select a notification type.'
        : undefined,
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

const emailRows = [
  {
    name: 'communication_emails',
    label: 'Communication emails',
    hint: 'Receive emails about your account activity.',
  },
  {
    name: 'marketing_emails',
    label: 'Marketing emails',
    hint: 'Receive emails about new products, features, and more.',
  },
  {
    name: 'social_emails',
    label: 'Social emails',
    hint: 'Receive emails for friend requests, follows, and more.',
  },
  {
    name: 'security_emails',
    label: 'Security emails',
    hint: 'Receive emails about your account activity and security.',
  },
] as const

export function NotificationsForm() {
  const styles = useStyles()
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  return (
    <form
      onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
      className={styles.form}
    >
      <Controller
        control={form.control}
        name='type'
        render={({ field, fieldState }) => (
          <Field
            label='Notify me about...'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <RadioGroup
              value={field.value}
              onChange={(_, data) => field.onChange(data.value)}
              className={styles.radios}
            >
              <Radio value='all' label='All new messages' />
              <Radio value='mentions' label='Direct messages and mentions' />
              <Radio value='none' label='Nothing' />
            </RadioGroup>
          </Field>
        )}
      />
      <div className={styles.emailSection}>
        <Text size={500} weight='semibold' className={styles.emailTitle}>
          Email Notifications
        </Text>
        <div className={styles.emailList}>
          {emailRows.map((row) => (
            <Controller
              key={row.name}
              control={form.control}
              name={row.name}
              render={({ field }) => (
                <div className={styles.emailRow}>
                  <div className={styles.emailText}>
                    <Text size={400} weight='semibold'>
                      {row.label}
                    </Text>
                    <Text size={300}>{row.hint}</Text>
                  </div>
                  <Switch
                    checked={field.value ?? false}
                    onChange={(_, data) => field.onChange(data.checked)}
                    disabled={row.name === 'security_emails'}
                    aria-label={row.label}
                  />
                </div>
              )}
            />
          ))}
        </div>
      </div>
      <Controller
        control={form.control}
        name='mobile'
        render={({ field }) => (
          <div className={styles.mobileRow}>
            <Checkbox
              checked={field.value ?? false}
              onChange={(_, data) => field.onChange(data.checked)}
              aria-label='Use different settings for my mobile devices'
            />
            <div className={styles.mobileText}>
              <Text size={400}>
                Use different settings for my mobile devices
              </Text>
              <Text size={300}>
                You can manage your mobile notifications in the{' '}
                <Link to='/settings'>mobile settings</Link> page.
              </Text>
            </div>
          </div>
        )}
      />
      <div>
        <Button type='submit'>Update notifications</Button>
      </div>
    </form>
  )
}
