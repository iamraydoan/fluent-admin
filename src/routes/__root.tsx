import { useMemo } from 'react'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { fluentTheme } from '@/lib/fluent-theme'
import { SearchProvider } from '@/context/search-provider'
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
  // FluentProvider, which now follows the same resolved theme.
  const { resolvedTheme } = useTheme()
  // Memoised so the provider keeps a stable theme object (only
  // fontFamilyBase differs from the stock web theme).
  const theme = useMemo(
    () => fluentTheme(resolvedTheme === 'dark' ? webDarkTheme : webLightTheme),
    [resolvedTheme]
  )
  return (
    <FluentProvider theme={theme}>
      <NavigationProgress />
      <ToastHost />
      {/* SearchProvider lives at the root (Phase 1 unification) so the
          CommandMenu renders exactly once and the Search button /
          Ctrl/Cmd+K work on every route — including /mes-agent,
          which previously had no provider and whose Search button
          did nothing. It was removed from AuthenticatedLayout. */}
      <SearchProvider>
        <Outlet />
      </SearchProvider>
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </FluentProvider>
  )
}

// errorComponent/notFoundComponent render outside RootComponent,
// so they do NOT inherit its FluentProvider. This shell wraps them
// in their own theme-following provider instead, so 404/500 pages
// get the same light/dark Fluent theme as the rest of the app.
// It works because ThemeProvider (main.tsx) wraps the whole router,
// so useTheme resolves here too. GeneralError/NotFoundError take no
// router error props, so no props need forwarding.
// eslint-disable-next-line react-refresh/only-export-components
function ThemedErrorShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  // Memoised so the provider keeps a stable theme object (only
  // fontFamilyBase differs from the stock web theme).
  const theme = useMemo(
    () => fluentTheme(resolvedTheme === 'dark' ? webDarkTheme : webLightTheme),
    [resolvedTheme]
  )
  return <FluentProvider theme={theme}>{children}</FluentProvider>
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: () => (
    <ThemedErrorShell>
      <NotFoundError />
    </ThemedErrorShell>
  ),
  errorComponent: () => (
    <ThemedErrorShell>
      <GeneralError />
    </ThemedErrorShell>
  ),
})
