import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ClerkFullLogo } from '@/assets/clerk-full-logo'
import { Logo } from '@/assets/logo'
import { Text } from '@/components/ui/text'
import { LearnMore } from '@/components/learn-more'

export const Route = createFileRoute('/clerk/(auth)')({
  component: ClerkAuthLayout,
})

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
  panel: {
    position: 'relative',
    display: 'none',
    '@media (min-width: 1024px)': {
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      backgroundColor: '#64748b', // No Fluent token expresses slate-500; the example auth panel grey is kept, not shifted to brand blue.
      padding: '40px',
      boxSizing: 'border-box',
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    // Ws6: tokenised to Base400 (16px, -2px). No 18px token exists;
    // 16px is chosen over 20px so the brand line does not outgrow
    // the auth panel's body text.
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForegroundOnBrand,
    textDecoration: 'none',
  },
  logoWrap: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quote: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: 'auto',
  },
  formSide: {
    padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalXXXL}`,
    boxSizing: 'border-box',
  },
  formInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalL,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  link: {
    textDecoration: 'underline',
    textDecorationStyle: 'dashed',
    textUnderlineOffset: '2px',
    color: tokens.colorBrandForegroundLink,
  },
})

// eslint-disable-next-line react-refresh/only-export-components
function ClerkAuthLayout() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <Link to='/' className={styles.brand}>
          <Logo />
          Fluent Admin
        </Link>

        <div className={styles.logoWrap}>
          <ClerkFullLogo style={{ width: 384, height: 384 }} />
        </div>

        <div className={styles.quote}>
          <Text size={500}>
            &ldquo; Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Sint, magni debitis inventore asperiores velit! &rdquo;
          </Text>
          <Text size={300}>John Doe</Text>
        </div>
      </div>
      <div className={styles.formSide}>
        <div className={styles.formInner}>
          <LearnMore defaultOpen>
            Welcome to the example Clerk auth page. <br />
            Back to{' '}
            <Link to='/' className={styles.link}>
              Dashboard
            </Link>{' '}
            ?
          </LearnMore>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
