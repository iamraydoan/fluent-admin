/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Open20Regular } from '@fluentui/react-icons'
import { MessageBar, MessageBarBody } from '@/components/ui/message-bar'
import { Separator } from '@/components/ui/separator'
import { Text } from '@/components/ui/text'
import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'

export const Route = createFileRoute('/clerk')({
  component: RouteComponent,
})

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function RouteComponent() {
  if (!PUBLISHABLE_KEY) {
    return <MissingClerkPubKey />
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/clerk/sign-in'
      signInUrl='/clerk/sign-in'
      signUpUrl='/clerk/sign-up'
      signInFallbackRedirectUrl='/clerk/user-management'
      signUpFallbackRedirectUrl='/clerk/user-management'
    >
      <Outlet />
    </ClerkProvider>
  )
}

const useStyles = makeStyles({
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '16px',
  },
  topBarActions: {
    display: 'flex',
    gap: '16px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: '672px',
  },
  messageTitle: {
    fontWeight: 600,
    display: 'block',
    marginBottom: '4px',
  },
  heading: {
    marginTop: '16px',
  },
  body: {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    color: tokens.colorNeutralForeground2,
  },
  steps: {
    listStyleType: 'decimal',
    listStylePosition: 'inside',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    paddingLeft: '0px',
    marginTop: '0px',
    marginBottom: '0px',
  },
  link: {
    textDecoration: 'underline',
    textDecorationStyle: 'dashed',
    textUnderlineOffset: '4px',
    color: tokens.colorBrandForegroundLink,
  },
  code: {
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusSmall,
    padding: '2px 4px',
    fontSize: '12px',
    fontWeight: 700,
  },
  sample: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: '#1e293b',
    padding: '12px 12px',
    fontSize: '14px',
    color: '#e2e8f0',
  },
  samplePre: {
    overflowX: 'auto',
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: '#0f172a',
    padding: '4px 8px',
    fontSize: '12px',
    marginTop: '0px',
    marginBottom: '0px',
  },
  separator: {
    marginTop: '16px',
    marginBottom: '16px',
    width: '100%',
  },
  note: {
    marginTop: '8px',
    fontSize: '14px',
  },
})

function MissingClerkPubKey() {
  const styles = useStyles()
  return (
    <AuthenticatedLayout>
      <div className={styles.topBar}>
        <div className={styles.topBarActions}>
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </div>
      <Main>
        <div className={styles.content}>
          <div className={styles.inner}>
            <MessageBar intent='warning'>
              <MessageBarBody>
                <Text className={styles.messageTitle}>
                  No Publishable Key Found!
                </Text>
                <Text>
                  You need to generate a publishable key from Clerk and put it
                  inside the <code className={styles.code}>.env</code> file.
                </Text>
              </MessageBarBody>
            </MessageBar>

            <Text size={700} weight='bold' className={styles.heading}>
              Set your Clerk API key
            </Text>
            <div className={styles.body}>
              <ol className={styles.steps}>
                <li>
                  In the{' '}
                  <a
                    href='https://go.clerk.com/GttUAaK'
                    target='_blank'
                    rel='noreferrer'
                    className={styles.link}
                  >
                    Clerk <Open20Regular />
                  </a>{' '}
                  Dashboard, navigate to the API keys page.
                </li>
                <li>
                  In the <strong>Quick Copy</strong> section, copy your Clerk
                  Publishable Key.
                </li>
                <li>
                  Rename <code className={styles.code}>.env.example</code> to{' '}
                  <code className={styles.code}>.env</code>
                </li>
                <li>
                  Paste your key into your{' '}
                  <code className={styles.code}>.env</code> file.
                </li>
              </ol>
              <Text>The final result should resemble the following:</Text>

              <div className={styles.sample}>
                <span>.env</span>
                <pre className={styles.samplePre}>
                  <code>VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY</code>
                </pre>
              </div>
            </div>

            <Separator className={styles.separator} />

            <MessageBar intent='info'>
              <MessageBarBody>
                <Text className={styles.messageTitle}>
                  Clerk Integration is Optional
                </Text>
                <Text>
                  The Clerk integration lives entirely inside{' '}
                  <code className={styles.code}>src/routes/clerk</code>. If you
                  plan to use Clerk as your auth service, you might want to
                  place <code className={styles.code}>ClerkProvider</code> at
                  the root route.
                </Text>
                <Text className={styles.note}>
                  However, if you don&apos;t plan to use Clerk, you can safely
                  remove this directory and related dependency{' '}
                  <code className={styles.code}>@clerk/react</code>.
                </Text>
                <Text className={styles.note}>
                  This setup is modular by design and won&apos;t affect the rest
                  of the application.
                </Text>
              </MessageBarBody>
            </MessageBar>
          </div>
        </div>
      </Main>
    </AuthenticatedLayout>
  )
}
