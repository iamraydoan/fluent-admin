import { makeStyles } from '@fluentui/react-components'
import { Text } from '@/components/ui/text'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { tasks } from './data/tasks'

const useStyles = makeStyles({
  search: {
    marginRight: 'auto',
  },
  pageHead: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '8px',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    fontWeight: 700,
  },
  content: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    gap: '16px',
  },
})

export function Tasks() {
  const styles = useStyles()
  return (
    <TasksProvider>
      <Header fixed>
        <div className={styles.search}>
          <Search />
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <div className={styles.content}>
          <div className={styles.pageHead}>
            <div>
              <h2 className={styles.title}>Tasks</h2>
              <Text>Here&apos;s a list of your tasks for this month!</Text>
            </div>
            <TasksPrimaryButtons />
          </div>
          <TasksTable data={tasks} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
