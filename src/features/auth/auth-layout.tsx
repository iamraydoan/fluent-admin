import { makeStyles, tokens } from '@fluentui/react-components'
import { Logo } from '@/assets/logo'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    minHeight: '100svh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalL}`,
    boxSizing: 'border-box',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: tokens.spacingVerticalS,
    width: '100%',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalL,
  },
})

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo />
          <Text size={500} weight='medium'>
            Shadcn Admin
          </Text>
        </div>
        {children}
      </div>
    </div>
  )
}
