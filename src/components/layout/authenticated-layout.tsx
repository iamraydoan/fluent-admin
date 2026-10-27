import { Outlet } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    minWidth: '0px',
    display: 'flex',
    flexDirection: 'column',
  },
})

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

// Fluent layout: sidebar + content column. The old shadcn
// SidebarProvider/SidebarInset/SidebarRail concepts are gone; the
// sidebar owns its collapsed state (cookie `sidebar_state`) and its
// toggle button lives in the sidebar header. LayoutProvider and
// SearchProvider are kept so screens that read them (settings, search)
// keep working; the sidebar itself does not follow the layout
// provider's collapsible/variant settings.
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const styles = useStyles()
  return (
    <SearchProvider>
      <LayoutProvider>
        <div className={styles.root}>
          <SkipToMain />
          <AppSidebar />
          <div id='content' className={styles.content}>
            {children ?? <Outlet />}
          </div>
        </div>
      </LayoutProvider>
    </SearchProvider>
  )
}
