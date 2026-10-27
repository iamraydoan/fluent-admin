import { makeStyles } from '@fluentui/react-components'
import { Logo } from '@/assets/logo'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    minHeight: '100svh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    boxSizing: 'border-box',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
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
