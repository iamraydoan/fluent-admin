import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  Delete24Regular,
  Key24Regular,
  Mail24Regular,
  MailAdd24Regular,
  MoreHorizontal24Regular,
  Person24Regular,
  PersonAdd24Regular,
  PersonProhibited24Regular,
  Shield24Regular,
} from '@fluentui/react-icons'
import { Card } from '@/components/ui/card'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
import { type UsersBulkController } from './components/data-table-bulk-actions'
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
  // CONTRACT: Users Refresh = reset-view, not reload-data. The data is
  // a static local array (no server reload to preserve state through),
  // so Refresh intentionally remounts the table (local sorting /
  // selection / column visibility reset) together with the URL
  // filter reset below. This is a deliberate contract, not a mixed
  // one: Dashboard Refresh preserves its tab, Users Refresh resets.
  const [refreshKey, setRefreshKey] = useState(0)
  // Bulk controller reported by the table: drives the ActionBar Bulk
  // group (disabled at 0 selected) and the More > Export action.
  const [bulk, setBulk] = useState<UsersBulkController | null>(null)
  const selectedCount = bulk?.selectedCount ?? 0
  const busy = bulk?.busyAction ?? null

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
                  {
                    label: 'Invite',
                    icon: <MailAdd24Regular />,
                    onClick: () => setOpen('invite'),
                  },
                  {
                    label: 'Add',
                    icon: <PersonAdd24Regular />,
                    onClick: () => setOpen('add'),
                  },
                ],
              },
              {
                label: 'Bulk',
                actions: [
                  {
                    label: 'Invite',
                    icon: <Mail24Regular />,
                    disabled: selectedCount === 0 || busy === 'invite',
                    onClick: () => bulk?.invite(),
                  },
                  {
                    label: 'Activate',
                    icon: <Person24Regular />,
                    disabled: selectedCount === 0 || busy === 'active',
                    onClick: () => bulk?.activate(),
                  },
                  {
                    label: 'Deactivate',
                    icon: <PersonProhibited24Regular />,
                    disabled: selectedCount === 0 || busy === 'inactive',
                    onClick: () => bulk?.deactivate(),
                  },
                  {
                    label: 'Reset password',
                    icon: <Key24Regular />,
                    disabled: selectedCount === 0 || busy === 'reset-password',
                    onClick: () => bulk?.requestResetPassword(),
                  },
                  {
                    label: 'Assign role',
                    icon: <Shield24Regular />,
                    disabled: selectedCount === 0,
                    onClick: () => bulk?.requestAssignRole(),
                  },
                  {
                    label: 'Delete',
                    icon: <Delete24Regular />,
                    disabled: selectedCount === 0,
                    onClick: () => bulk?.requestDelete(),
                  },
                ],
              },
              {
                label: 'Actions',
                actions: [
                  {
                    label: 'More',
                    icon: <MoreHorizontal24Regular />,
                    menuItems: [
                      {
                        label: 'Export',
                        onClick: () => bulk?.exportCsv(),
                      },
                    ],
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
              onBulkChange={setBulk}
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
