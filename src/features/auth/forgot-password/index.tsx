import { Link } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { AuthLayout } from '../auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

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

export function ForgotPassword() {
  const styles = useStyles()
  return (
    <AuthLayout>
      <Card className={styles.card}>
        <Text size={500} weight='semibold'>
          Forgot Password
        </Text>
        <Text className={styles.description}>
          Enter your registered email and we will send you a link to reset your
          password.
        </Text>
        <ForgotPasswordForm />
        <Text size={300} className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to='/sign-up' className={styles.link}>
            Sign up
          </Link>
          .
        </Text>
      </Card>
    </AuthLayout>
  )
}
