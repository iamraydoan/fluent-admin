import { Link } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { AuthLayout } from '../auth-layout'
import { OtpForm } from './components/otp-form'

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    width: '100%',
    maxWidth: '448px',
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

export function Otp() {
  const styles = useStyles()
  return (
    <AuthLayout>
      <Card className={styles.card}>
        <Text size={500} weight='semibold'>
          Two-factor Authentication
        </Text>
        <Text className={styles.description}>
          Please enter the authentication code. We have sent the authentication
          code to your email.
        </Text>
        <OtpForm />
        <Text size={300} className={styles.footer}>
          Haven&apos;t received it?{' '}
          <Link to='/sign-in' className={styles.link}>
            Resend a new code.
          </Link>
          .
        </Text>
      </Card>
    </AuthLayout>
  )
}
