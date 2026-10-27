// Fluent Dialog wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Dialog styling system-wide.
import {
  Dialog as FluentDialog,
  DialogActions as FluentDialogActions,
  DialogBody as FluentDialogBody,
  DialogContent as FluentDialogContent,
  DialogSurface as FluentDialogSurface,
  DialogTitle as FluentDialogTitle,
  DialogTrigger as FluentDialogTrigger,
  type DialogActionsProps,
  type DialogBodyProps,
  type DialogContentProps,
  type DialogProps,
  type DialogSurfaceProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from '@fluentui/react-components'

export function Dialog(props: DialogProps) {
  return <FluentDialog {...props} />
}

export function DialogSurface(props: DialogSurfaceProps) {
  return <FluentDialogSurface {...props} />
}

export function DialogTitle(props: DialogTitleProps) {
  return <FluentDialogTitle {...props} />
}

export function DialogBody(props: DialogBodyProps) {
  return <FluentDialogBody {...props} />
}

export function DialogActions(props: DialogActionsProps) {
  return <FluentDialogActions {...props} />
}

export function DialogContent(props: DialogContentProps) {
  return <FluentDialogContent {...props} />
}

export function DialogTrigger(props: DialogTriggerProps) {
  return <FluentDialogTrigger {...props} />
}
