// Minimal imperative toast API for the old screens.
// Call shape kept identical to the previous `toast.error(...)` calls:
// toast.error(message), toast.success(message), toast.info(message).
// Delivery is a window CustomEvent consumed by <ToastHost /> (mounted
// in __root.tsx inside FluentProvider); there is no React state here,
// so this module is safe to import from non-component code such as
// handle-server-error.ts and main.tsx.

export const APP_TOAST_EVENT = 'app-toast'

export type ToastKind = 'error' | 'success' | 'info'

export type AppToastDetail = {
  kind: ToastKind
  message: string
}

function dispatch(kind: ToastKind, message: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<AppToastDetail>(APP_TOAST_EVENT, {
      detail: { kind, message },
    })
  )
}

export const toast = {
  error: (message: string) => dispatch('error', message),
  success: (message: string) => dispatch('success', message),
  info: (message: string) => dispatch('info', message),
}
