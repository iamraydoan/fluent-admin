// Fluent Toast wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Toast styling system-wide. The imperative toast() API lives
// in @/lib/toast and the mounted host in @/components/toast-host.
import {
  Toast as FluentToast,
  ToastBody as FluentToastBody,
  ToastTitle as FluentToastTitle,
  Toaster as FluentToaster,
  type ToastBodyProps,
  type ToastProps,
  type ToastTitleProps,
  type ToasterProps,
} from '@fluentui/react-components'

export function Toast(props: ToastProps) {
  return <FluentToast {...props} />
}

export function ToastTitle(props: ToastTitleProps) {
  return <FluentToastTitle {...props} />
}

export function ToastBody(props: ToastBodyProps) {
  return <FluentToastBody {...props} />
}

export function Toaster(props: ToasterProps) {
  return <FluentToaster {...props} />
}
