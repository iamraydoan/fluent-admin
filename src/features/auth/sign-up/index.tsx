import { Link } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    width: '100%',
    maxWidth: '384px',
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
    boxSizing: 'border-box',
  },
  description: {
    color: tokens.colorNeutralForeground2,
  },
  link: {
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    color: tokens.colorBrandForegroundLink,
  },
  footer: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
    paddingLeft: tokens.spacingHorizontalXXXL,
    paddingRight: tokens.spacingHorizontalXXXL,
  },
})

export function SignUp() {
  const styles = useStyles()
  return (
    <AuthLayout>
      <Card className={styles.card}>
        <Text size={500} weight='semibold'>
          Create an account
        </Text>
        <Text className={styles.description}>
          Enter your email and password to create an account. Already have an
          account?{' '}
          <Link to='/sign-in' className={styles.link}>
            Sign In
          </Link>
        </Text>
        <SignUpForm />
        <Text size={300} className={styles.footer}>
          By creating an account, you agree to our{' '}
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
