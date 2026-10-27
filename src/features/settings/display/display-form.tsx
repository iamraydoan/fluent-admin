import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXXL,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
})

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const styles = useStyles()
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })

  return (
    <form
      onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
      className={styles.form}
    >
      <Controller
        control={form.control}
        name='items'
        render={({ field, fieldState }) => (
          <Field
            label='Sidebar'
            hint='Select the items you want to display in the sidebar.'
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : 'none'}
          >
            <div className={styles.list}>
              {items.map((item) => {
                const checked = field.value?.includes(item.id) ?? false
                return (
                  <Checkbox
                    key={item.id}
                    label={item.label}
                    checked={checked}
                    onChange={(_, data) => {
                      field.onChange(
                        data.checked
                          ? [...(field.value ?? []), item.id]
                          : (field.value ?? []).filter(
                              (value) => value !== item.id
                            )
                      )
                    }}
                  />
                )
              })}
            </div>
          </Field>
        )}
      />
      <div>
        <Button type='submit' appearance='primary'>
          Update display
        </Button>
      </div>
    </form>
  )
}
