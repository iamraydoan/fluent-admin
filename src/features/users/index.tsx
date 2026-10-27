import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  MailAdd24Regular,
  PersonAdd24Regular,
} from '@fluentui/react-icons'
import { Card } from '@/components/ui/card'
import HeaderBlock from '@/features/mes-agent/components/HeaderBlock'
import Ribbon from '@/features/mes-agent/components/Ribbon'
import { UsersDialogs } from './components/users-dialogs'
import { UsersProvider, useUsers } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { users } from './data/users'

const route = getRouteApi('/_authenticated/users/')

const useStyles = makeStyles({
  content: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    minHeight: 0,
  },
})

function UsersScreen() {
  const styles = useStyles()
  const { setOpen } = useUsers()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  // Bumped on ribbon Refresh so the table remounts (local sorting /
  // selection / column visibility reset) together with the URL
  // filter reset below.
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    void navigate({
      search: { page: 1, pageSize: 10, status: [], role: [], username: '' },
    })
    setRefreshKey((key) => key + 1)
  }

  return (
    <>
      <HeaderBlock
        title='Users'
        ribbon={
          <Ribbon
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise24Regular />,
                    onClick: handleRefresh,
                  },
                ],
              },
              {
                label: 'Actions',
                actions: [
                  {
                    label: 'Invite User',
                    icon: <MailAdd24Regular />,
                    onClick: () => setOpen('invite'),
                  },
                  {
                    label: 'Add User',
                    icon: <PersonAdd24Regular />,
                    onClick: () => setOpen('add'),
                  },
                ],
              },
            ]}
          />
        }
      />
      <div className={styles.content}>
        <Card
          style={{
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className={styles.cardBody}>
            <UsersTable
              key={refreshKey}
              data={users}
              search={search}
              navigate={navigate}
            />
          </div>
        </Card>
      </div>
      <UsersDialogs />
    </>
  )
}

export function Users() {
  return (
    <UsersProvider>
      <UsersScreen />
    </UsersProvider>
  )
}
