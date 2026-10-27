import { makeStyles, tokens } from '@fluentui/react-components'
import { Button } from '@/components/ui/button'

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: '0',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
  },
  surface: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
    maxWidth: '480px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  title: {
    margin: '0',
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
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
  /** Accepted for API compatibility with existing callers; no longer applied. */
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
  } = props

  if (!open) {
    return null
  }

  return (
    <div className={styles.overlay}>
      <div role='dialog' aria-modal='true' className={styles.surface}>
        <h2 className={styles.title}>{title}</h2>
        <div>{desc}</div>
        {children}
        <div className={styles.footer}>
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
            appearance='primary'
            disabled={disabled || isLoading}
          >
            {confirmText ?? 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}
