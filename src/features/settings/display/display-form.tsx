import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  NAV_DISPLAY_ITEMS,
  loadNavVisibility,
  saveNavVisibility,
  visibleNavItemIds,
  type NavVisibilityId,
} from '@/lib/nav-visibility'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Text } from '@/components/ui/text'

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
    marginTop: tokens.spacingVerticalS,
  },
  groupLabel: {
    display: 'block',
  },
  groupHint: {
    display: 'block',
    marginTop: tokens.spacingVerticalXXS,
  },
  groupError: {
    display: 'block',
    marginTop: tokens.spacingVerticalXS,
    color: tokens.colorPaletteRedForeground1,
  },
})

// Real navigation items, wired to actual nav visibility (see
// lib/nav-visibility.ts). These replaced the old unrelated list
// (Recents/Home/Applications/Desktop/Downloads/Documents), which
// matched no real sidebar entry. 'settings' toggles the whole
// Settings parent, including its sub-items.
const items = NAV_DISPLAY_ITEMS

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// Initial selection is the nav's current visibility, read from
// localStorage (all visible on first run). There is no backend in
// this FE-only template, so there is no database/API value to read.
const defaultValues: DisplayFormValues = {
  items: visibleNavItemIds(loadNavVisibility()),
}

export function DisplayForm() {
  const styles = useStyles()
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })

  const { isDirty, isSubmitting } = form.formState

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        // Wired to the real nav: persist the toggles to localStorage
        // and notify NavigationPane, which updates immediately.
        // Local demo only (FE template, no backend): the save is to
        // this browser only, and the toast says so.
        const selected = new Set(data.items)
        const visibility = Object.fromEntries(
          NAV_DISPLAY_ITEMS.map((item) => [item.id, selected.has(item.id)])
        ) as Record<NavVisibilityId, boolean>
        saveNavVisibility(visibility)
        showSubmittedData(
          data,
          'Local demo only — saved to this browser only. Submitted values:'
        )
        form.reset(data)
      })}
      className={styles.form}
    >
      <Controller
        control={form.control}
        name='items'
        render={({ field, fieldState }) => (
          <div>
            <Text size={400} weight='semibold' className={styles.groupLabel}>
              Sidebar
            </Text>
            <Text size={300} className={styles.groupHint}>
              Select the items you want to display in the sidebar. At least one
              item must stay visible; hidden items stay reachable by direct URL,
              so this screen can always restore them.
            </Text>
            <div className={styles.list}>
              {items.map((item) => {
                const checked = field.value?.includes(item.id) ?? false
                return (
                  // Each checkbox gets its own Field, its own label and
                  // its own id. Previously all six shared one Field, so
                  // they shared one DOM id and clicking Applications
                  // toggled Recents instead.
                  <Field key={item.id}>
                    <Checkbox
                      id={`display-item-${item.id}`}
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
                  </Field>
                )
              })}
            </div>
            {fieldState.error?.message ? (
              <Text size={300} className={styles.groupError}>
                {fieldState.error.message}
              </Text>
            ) : null}
          </div>
        )}
      />
      <div>
        <Button
          type='submit'
          appearance='primary'
          disabled={!isDirty || isSubmitting}
        >
          Update display
        </Button>
      </div>
    </form>
  )
}
