// Shared confirm dialog, re-implemented on Fluent Dialog (via the
// ui/dialog wrappers) so it gets the real modal behaviours the old
// plain-div overlay lacked: Escape closes, backdrop click closes,
// and focus is trapped inside the dialog (Fluent modal + tabster).
// API is preserved exactly: type-to-confirm callers pass `disabled`
// (confirm stays disabled until the exact text is typed) and either
// `form` (confirm submits the desc form) or `handleConfirm`.
// Destructive treatment: Fluent Button v9 has NO danger appearance,
// so in this one place a destructive confirm renders as a
// red-tinted secondary button (light red background, dark red text,
// stronger red tint on hover) instead of the default primary blue.
// The tint applies only while the button is enabled; a disabled
// destructive confirm falls back to the plain secondary disabled
// look so it never reads as actionable.
import { makeStyles, tokens } from '@fluentui/react-components'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@/components/ui/dialog'

const useStyles = makeStyles({
  dangerButton: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground2,
    ':hover': {
      backgroundColor: tokens.colorPaletteRedBackground2,
      color: tokens.colorPaletteRedForeground2,
    },
  },
})

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  disabled?: boolean
  desc: React.JSX.Element | string
  cancelBtnText?: string
  confirmText?: React.ReactNode
  destructive?: boolean
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
} & (
  | { form: string; handleConfirm?: undefined }
  | { form?: undefined; handleConfirm: () => void }
)

export function ConfirmDialog(props: ConfirmDialogProps) {
  const styles = useStyles()
  const {
    open,
    onOpenChange,
    title,
    desc,
    children,
    confirmText,
    cancelBtnText,
    disabled = false,
    form,
    handleConfirm,
    isLoading,
    destructive,
    className,
  } = props

  if (!open) {
    return null
  }

  const confirmDisabled = disabled || isLoading

  return (
    <Dialog
      open
      onOpenChange={(_, data) => {
        if (!data.open) onOpenChange(false)
      }}
    >
      <DialogSurface className={className}>
        <DialogBody>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {desc}
            {children}
          </DialogContent>
          <DialogActions>
            <Button
              appearance='secondary'
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              {cancelBtnText ?? 'Cancel'}
            </Button>
            <Button
              type={form ? 'submit' : 'button'}
              form={form}
              onClick={handleConfirm}
              appearance={destructive ? 'secondary' : 'primary'}
              className={
                destructive && !confirmDisabled
                  ? styles.dangerButton
                  : undefined
              }
              disabled={confirmDisabled}
            >
              {confirmText ?? 'Continue'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
