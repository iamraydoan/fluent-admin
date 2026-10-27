import { Link, useSearch } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    maxWidth: '384px',
    padding: '24px',
    boxSizing: 'border-box',
  },
  description: {
    color: tokens.colorNeutralForeground2,
  },
  link: {
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    color: tokens.colorBrandForegroundLink,
    whiteSpace: 'nowrap',
  },
  footer: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
    paddingLeft: '32px',
    paddingRight: '32px',
  },
})

export function SignIn() {
  const styles = useStyles()
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className={styles.card}>
        <Text size={500} weight='semibold'>
          Sign in
        </Text>
        <Text className={styles.description}>
          Enter your email and password below to log into your account.
          Don&apos;t have an account?{' '}
          <Link to='/sign-up' className={styles.link}>
            Sign Up
          </Link>
        </Text>
        <UserAuthForm redirectTo={redirect} />
        <Text size={300} className={styles.footer}>
          By clicking sign in, you agree to our{' '}
          <a href='/terms' className={styles.link}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href='/privacy' className={styles.link}>
            Privacy Policy
          </a>
          .
        </Text>
      </Card>
    </AuthLayout>
  )
}
