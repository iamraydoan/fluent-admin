/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useAuth, UserButton } from '@clerk/react'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  MailAdd24Regular,
  PersonAdd24Regular,
} from '@fluentui/react-icons'
import { ClerkLogo } from '@/assets/clerk-logo'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/text'
import HeaderBlock from '@/components/layout/header-block'
import Ribbon from '@/components/layout/ribbon'
import { LearnMore } from '@/components/learn-more'
import { ErrorLayout } from '@/features/errors/error-layout'
import { UsersDialogs } from '@/features/users/components/users-dialogs'
import {
  UsersProvider,
  useUsers,
} from '@/features/users/components/users-provider'
import { UsersTable } from '@/features/users/components/users-table'
import { users } from '@/features/users/data/users'

export const Route = createFileRoute('/clerk/_authenticated/user-management')({
  component: UserManagement,
})

const useStyles = makeStyles({
  loading: {
    display: 'flex',
    minHeight: '100svh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // List full-height chain, same as /users (shared UsersTable):
  // page never scrolls, only the table body scrolls, card fills the
  // remaining viewport height after the header block.
  content: {
    flex: '1',
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
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
    gap: '16px',
    padding: '16px',
  },
  accountRow: {
    flexShrink: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  accountNote: {
    color: tokens.colorNeutralForeground2,
  },
  accountLabel: {
    color: tokens.colorNeutralForeground2,
  },
  link: {
    textDecoration: 'underline',
    textDecorationStyle: 'dashed',
    textUnderlineOffset: '2px',
    color: tokens.colorBrandForegroundLink,
  },
  learnMoreText: {
    marginTop: '0px',
    marginBottom: '0px',
  },
  learnMoreTextSpaced: {
    marginTop: '16px',
    marginBottom: '0px',
  },
  countdown: {
    marginTop: '16px',
    height: '32px',
    textAlign: 'center',
  },
})

function UserManagement() {
  const styles = useStyles()
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <Spinner size='large' />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Unauthorized />
  }

  return (
    <UsersProvider>
      <ClerkUsersScreen />
    </UsersProvider>
  )
}

// Same unified shell as /users (see src/features/users/index.tsx):
// the AuthenticatedLayout already renders AppSidebar, and HeaderBlock
// renders the multi-tab document strip, ribbon and title strip. The
// old page header (Header + Search + ThemeSwitch + ConfigDrawer) and
// Main wrapper are gone. The list itself is the shared UsersTable,
// so the Entity Types table pattern (count, filter, 35px rows,
// pagination) comes along unchanged.
//
// Clerk sign-out placement (Phase 2F, supersedes the Phase 1C card
// row): the Clerk UserButton is passed as HeaderBlock's accountAction
// slot, so it REPLACES the unified SN avatar at the right of the
// document tab strip on this screen only. The slot is a plain node, so
// the shared shell never imports Clerk; this page is rendered inside
// the /clerk route's ClerkProvider (key present), so the button has
// its provider here. Every other screen passes no slot and keeps the
// SN avatar unchanged. UserButton opens Clerk's own profile menu, so
// sign-out and account management keep working exactly as before.
function ClerkUsersScreen() {
  const styles = useStyles()
  const { setOpen } = useUsers()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  // Bumped on ribbon Refresh so the table remounts (local sorting /
  // selection / column visibility reset) together with the URL
  // filter reset below — same as /users.
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    void navigate({
      search: {
        page: 1,
        pageSize: 25,
        status: [],
        role: [],
        username: '',
        email: '',
      },
    })
    setRefreshKey((key) => key + 1)
  }

  return (
    <>
      <HeaderBlock
        title='User Management'
        accountAction={<UserButton />}
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
          className={styles.card}
          style={{
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className={styles.cardBody}>
            <div className={styles.accountRow}>
              <Text className={styles.accountNote}>
                Manage your users and their roles here. This is the same as{' '}
                <Link to='/users' className={styles.link}>
                  &apos;/users&apos;
                </Link>
              </Text>
              {/* Signed-in account lives in the document tab strip now
                  (accountAction above); the card keeps only this note,
                  so the Clerk button is not duplicated. */}
              <Text className={styles.accountLabel}>Signed in via Clerk</Text>
            </div>
            <UsersTable
              key={refreshKey}
              data={users}
              navigate={navigate}
              search={search}
            />
          </div>
        </Card>
      </div>
      <UsersDialogs />
    </>
  )
}

const COUNTDOWN = 5 // Countdown second

function Unauthorized() {
  const styles = useStyles()
  const navigate = useNavigate()
  const { history } = useRouter()

  const [opened, setOpened] = useState(true)
  const [cancelled, setCancelled] = useState(false)
  const [countdown, setCountdown] = useState(COUNTDOWN)

  // Set and run the countdown conditionally
  useEffect(() => {
    if (cancelled || opened) return
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [cancelled, opened])

  // Navigate to sign-in page when countdown hits 0
  useEffect(() => {
    if (countdown > 0) return
    navigate({ to: '/clerk/sign-in' })
  }, [countdown, navigate])

  return (
    <ErrorLayout
      code='401'
      title='Unauthorized Access'
      description={
        <>
          You must be authenticated via Clerk{' '}
          <LearnMore open={opened} onOpenChange={setOpened}>
            <p className={styles.learnMoreText}>
              This is the same as{' '}
              <Link to='/users' className={styles.link}>
                &apos;/users&apos;
              </Link>
              .{' '}
            </p>
            <p className={styles.learnMoreText}>
              You must first sign in using Clerk to access this route.{' '}
            </p>

            <p className={styles.learnMoreTextSpaced}>
              After signing in, you&apos;ll be able to sign out or delete your
              account via the Clerk account button in the document tab strip of
              the User Management page.
            </p>
          </LearnMore>
          <br />
          to access this resource.
        </>
      }
      footer={
        <div className={styles.countdown}>
          {!cancelled && !opened && (
            <>
              <Text>
                {countdown > 0
                  ? `Redirecting to Sign In page in ${countdown}s`
                  : `Redirecting...`}
              </Text>
              <Button
                appearance='transparent'
                onClick={() => setCancelled(true)}
              >
                Cancel Redirect
              </Button>
            </>
          )}
        </div>
      }
    >
      <Button appearance='outline' onClick={() => history.go(-1)}>
        Go Back
      </Button>
      <Button
        appearance='primary'
        onClick={() => navigate({ to: '/clerk/sign-in' })}
        icon={<ClerkLogo style={{ width: 20, height: 20 }} />}
      >
        Sign in
      </Button>
    </ErrorLayout>
  )
}
