import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Radio, RadioGroup } from '@/components/ui/radio-group'

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
})

// Font is locked to the Segoe UI Variable stack in
// src/lib/fluent-theme.ts, so there is no font field here: a
// single-option picker would be dead UI.
const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
  const styles = useStyles()
  const { theme, setTheme } = useTheme()

  // This can come from your database or API. The form value is the
  // stored theme itself, so System is a real option matching the
  // header ThemeSwitch (Light / Dark / System), not mapped to Light.
  const defaultValues: Partial<AppearanceFormValues> = {
    theme,
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  const { isDirty, isSubmitting } = form.formState

  function onSubmit(data: AppearanceFormValues) {
    if (data.theme != theme) setTheme(data.theme)

    showSubmittedData(data, 'Local demo only — not saved. Submitted values:')
    form.reset(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        control={form.control}
        name='theme'
        render={({ field, fieldState }) => (
          <Field
            label='Theme'
            hint='Select the theme for the dashboard.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <RadioGroup
              value={field.value}
              onChange={(_, data) => field.onChange(data.value)}
              className={styles.radios}
            >
              <Radio value='light' label='Light' />
              <Radio value='dark' label='Dark' />
              <Radio value='system' label='System' />
            </RadioGroup>
          </Field>
        )}
      />
      <div>
        <Button
          type='submit'
          appearance='primary'
          disabled={!isDirty || isSubmitting}
        >
          Update preferences
        </Button>
      </div>
    </form>
  )
}
