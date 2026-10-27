import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'

const useStyles = makeStyles({
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fileInput: {
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '6px 8px',
    font: 'inherit',
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
  },
})

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file.',
    })
    .refine(
      (files) => ['text/csv'].includes(files?.[0]?.type),
      'Please upload csv format.'
    ),
})

type TaskImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({
  open,
  onOpenChange,
}: TaskImportDialogProps) {
  const styles = useStyles()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const onSubmit = () => {
    const file = form.getValues('file')

    if (file && file[0]) {
      const fileDetails = {
        name: file[0].name,
        size: file[0].size,
        type: file[0].type,
      }
      showSubmittedData(fileDetails, 'You have imported the following file:')
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        onOpenChange(data.open)
        form.reset()
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogContent>
            <div className={styles.titleRow}>
              <div>
                <DialogTitle>Import Tasks</DialogTitle>
                <Text>Import tasks quickly from a CSV file.</Text>
              </div>
              <DialogTrigger action='close'>
                <Tooltip content='Close' relationship='label'>
                  <Button
                    appearance='subtle'
                    size='small'
                    icon={<Dismiss20Regular />}
                    aria-label='Close'
                  />
                </Tooltip>
              </DialogTrigger>
            </div>
            <form
              id='task-import-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className={styles.form}
            >
              <Controller
                control={form.control}
                name='file'
                render={({ field, fieldState }) => (
                  <div className={styles.field}>
                    <Label htmlFor='task-import-file'>File</Label>
                    {/* Kept native on purpose (Phase 2E): Fluent Input
                    rejects type='file' (its text-based types do not
                    include file), so there is no equivalent ui/input
                    wrapper for a file picker. */}
                    <input
                      id='task-import-file'
                      type='file'
                      accept='text/csv'
                      className={styles.fileInput}
                      onChange={(event) => field.onChange(event.target.files)}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                    {fieldState.error?.message && (
                      <Text className={styles.error}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </div>
                )}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <DialogTrigger action='close'>
              <Button appearance='secondary'>Close</Button>
            </DialogTrigger>
            <Button appearance='primary' type='submit' form='task-import-form'>
              Import
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
