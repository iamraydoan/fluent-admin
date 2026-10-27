import { getRouteApi } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { users } from './data/users'

const useStyles = makeStyles({
  searchPush: {
    marginInlineEnd: 'auto',
  },
  main: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    gap: '16px',
  },
  headingRow: {
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
    lineHeight: '32px',
  },
  subtitle: {
    margin: '4px 0 0',
    color: tokens.colorNeutralForeground2,
    fontSize: '14px',
    lineHeight: '20px',
  },
})

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const styles = useStyles()
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <UsersProvider>
      <Header fixed>
        <div className={styles.searchPush}>
          <Search />
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className={styles.main}>
        <div className={styles.headingRow}>
          <div>
            <h2 className={styles.title}>User List</h2>
            <p className={styles.subtitle}>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable data={users} search={search} navigate={navigate} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
