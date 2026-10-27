import { useEffect } from 'react'
import { useToastController } from '@fluentui/react-components'
import { APP_TOAST_EVENT, type AppToastDetail } from '@/lib/toast'
import { Toast, ToastTitle, Toaster } from '@/components/ui/toast'

// The single Fluent Toaster id for the whole app. Must be mounted
// inside FluentProvider (see __root.tsx); the id here must match the
// id passed to useToastController.
const TOASTER_ID = 'app-toaster'

export function ToastHost() {
  const { dispatchToast } = useToastController(TOASTER_ID)

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<AppToastDetail>).detail
      if (!detail || typeof detail.message !== 'string') return
      dispatchToast(
        <Toast>
          <ToastTitle>{detail.message}</ToastTitle>
        </Toast>,
        { intent: detail.kind }
      )
    }
    window.addEventListener(APP_TOAST_EVENT, handler)
    return () => window.removeEventListener(APP_TOAST_EVENT, handler)
  }, [dispatchToast])

  return <Toaster toasterId={TOASTER_ID} />
}
