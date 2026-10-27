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
import { ClerkLogo } from '@/assets/clerk-logo'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Text } from '@/components/ui/text'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LearnMore } from '@/components/learn-more'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ErrorLayout } from '@/features/errors/error-layout'
import { UsersDialogs } from '@/features/users/components/users-dialogs'
import { UsersPrimaryButtons } from '@/features/users/components/users-primary-buttons'
import { UsersProvider } from '@/features/users/components/users-provider'
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
  searchWrap: {
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  titleRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '8px',
  },
  subtitleRow: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  subtitle: {
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
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const [opened, setOpened] = useState(true)
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
      <Header fixed>
        <div className={styles.searchWrap}>
          <Search />
        </div>
        <ThemeSwitch />
        <ConfigDrawer />
        <UserButton />
      </Header>

      <Main>
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <div>
              <Text size={700} weight='bold'>
                User List
              </Text>
              <div className={styles.subtitleRow}>
                <Text className={styles.subtitle}>
                  Manage your users and their roles here.
                </Text>
                <LearnMore open={opened} onOpenChange={setOpened}>
                  <p className={styles.learnMoreText}>
                    This is the same as{' '}
                    <Link to='/users' className={styles.link}>
                      &apos;/users&apos;
                    </Link>
                  </p>

                  <p className={styles.learnMoreTextSpaced}>
                    You can sign out or manage/delete your account via the User
                    Profile menu in the top-right corner of the page.
                  </p>
                </LearnMore>
              </div>
            </div>
            <UsersPrimaryButtons />
          </div>
          <UsersTable data={users} navigate={navigate} search={search} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
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
              account via the User Profile dropdown on this page.
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
