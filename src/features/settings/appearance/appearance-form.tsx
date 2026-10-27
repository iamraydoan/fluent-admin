import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fonts } from '@/config/fonts'
import { makeStyles } from '@fluentui/react-components'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Radio, RadioGroup } from '@/components/ui/radio-group'
import { Select } from '@/components/ui/select'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  select: {
    textTransform: 'capitalize',
  },
  radios: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
})

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark']),
  font: z.enum(fonts),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
  const styles = useStyles()
  const { font, setFont } = useFont()
  const { theme, setTheme } = useTheme()

  // This can come from your database or API.
  const defaultValues: Partial<AppearanceFormValues> = {
    theme: theme === 'dark' ? 'dark' : 'light',
    font,
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  function onSubmit(data: AppearanceFormValues) {
    if (data.font != font) setFont(data.font)
    if (data.theme != theme) setTheme(data.theme)

    showSubmittedData(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Controller
        control={form.control}
        name='font'
        render={({ field, fieldState }) => (
          <Field
            label='Font'
            hint='Set the font you want to use in the dashboard.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <Select
              value={field.value}
              onChange={(e) =>
                field.onChange(e.target.value as AppearanceFormValues['font'])
              }
              onBlur={field.onBlur}
              className={styles.select}
            >
              {fonts.map((fontOption) => (
                <option key={fontOption} value={fontOption}>
                  {fontOption}
                </option>
              ))}
            </Select>
          </Field>
        )}
      />
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
            </RadioGroup>
          </Field>
        )}
      />
      <div>
        <Button type='submit'>Update preferences</Button>
      </div>
    </form>
  )
}
