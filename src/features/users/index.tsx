import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  MailAdd24Regular,
  PersonAdd24Regular,
} from '@fluentui/react-icons'
import { Card } from '@/components/ui/card'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
import { UsersDialogs } from './components/users-dialogs'
import { UsersProvider, useUsers } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { users } from './data/users'

const route = getRouteApi('/_authenticated/users/')

const useStyles = makeStyles({
  // List full-height chain (see users-table): the page itself must
  // never scroll — only the table body scrolls. So this content
  // column is overflow hidden (not auto), and the card below fills
  // exactly the remaining viewport height after the page top.
  content: {
    flex: '1',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  // Same pattern as the MES MainCard: the card is a flex column that
  // fills its parent, so the table inside can flex and scroll while
  // the pagination footer stays pinned at the card bottom.
  card: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardBody: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
  },
})

function UsersScreen() {
  const styles = useStyles()
  const { setOpen } = useUsers()
  const search = route.useSearch()
  const navigate = route.useNavigate()
  // Bumped on action bar Refresh so the table remounts (local sorting /
  // selection / column visibility reset) together with the URL
  // filter reset below.
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    void navigate({
      search: {
        page: 1,
        pageSize: 25,
        status: [],
        role: [],
        department: [],
        accountType: [],
        username: '',
        email: '',
      },
    })
    setRefreshKey((key) => key + 1)
  }

  return (
    <>
      <PageTop
        title='Users'
        actionBar={
          <ActionBar
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
          className={styles.card}
          style={{
            borderRadius: tokens.borderRadiusXLarge,
            boxShadow: tokens.shadow2,
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
