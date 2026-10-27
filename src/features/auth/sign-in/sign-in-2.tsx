import { Link } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Logo } from '@/assets/logo'
import { Text } from '@/components/ui/text'
import dashboardLight from './assets/dashboard-light.png'
import { UserAuthForm } from './components/user-auth-form'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'grid',
    minHeight: '100svh',
    alignItems: 'center',
    justifyContent: 'center',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  left: {
    padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalXXXL}`,
    boxSizing: 'border-box',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalL,
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: tokens.spacingVerticalS,
    width: '100%',
    maxWidth: '384px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heading: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
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
    paddingLeft: tokens.spacingHorizontalXXXL,
    paddingRight: tokens.spacingHorizontalXXXL,
  },
  panel: {
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'block',
      position: 'relative',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  panelImage: {
    position: 'absolute',
    top: '15%',
    left: '80px',
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'top left',
    userSelect: 'none',
  },
})

export function SignIn2() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <Logo />
          <Text size={500} weight='medium'>
            Shadcn Admin
          </Text>
        </div>
        <div className={styles.formColumn}>
          <div className={styles.heading}>
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
          </div>
          <UserAuthForm />
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
        </div>
      </div>

      <div className={styles.panel}>
        <img
          src={dashboardLight}
          className={styles.panelImage}
          width={1024}
          height={1151}
          alt='Shadcn-Admin'
        />
      </div>
    </div>
  )
}
