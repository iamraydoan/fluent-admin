import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useTheme } from '@/context/theme-provider'
import { NavigationProgress } from '@/components/navigation-progress'
import { ToastHost } from '@/components/toast-host'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'

// eslint-disable-next-line react-refresh/only-export-components
function RootComponent() {
  // ThemeProvider (in main.tsx) wraps the router, so the resolved
  // theme is available here. Dark maps to webDarkTheme, light and
  // system-resolved-light to webLightTheme. MES keeps its own nested
  // FluentProvider with webLightTheme; a nested same-theme provider
  // does not change MES visuals.
  // Note: errorComponent/notFoundComponent render outside this
  // component, so they are not covered by this provider (Phase B
  // screens will bring their own coverage if needed).
  const { resolvedTheme } = useTheme()
  return (
    <FluentProvider
      theme={resolvedTheme === 'dark' ? webDarkTheme : webLightTheme}
    >
      <NavigationProgress />
      <ToastHost />
      <Outlet />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </FluentProvider>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
