import { makeStyles, tokens } from '@fluentui/react-components'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100svh',
    width: '100%',
  },
  inner: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '24px',
    boxSizing: 'border-box',
  },
  code: {
    fontSize: '112px',
    lineHeight: '1.1',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  title: {
    fontWeight: 600,
  },
  description: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
  },
  actions: {
    marginTop: '24px',
    display: 'flex',
    gap: '16px',
  },
})

type ErrorLayoutProps = {
  code?: string
  title: string
  description: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
}

export function ErrorLayout({
  code,
  title,
  description,
  children,
  footer,
}: ErrorLayoutProps) {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        {code ? <Text className={styles.code}>{code}</Text> : null}
        <Text size={500} weight='semibold' className={styles.title}>
          {title}
        </Text>
        <Text className={styles.description}>{description}</Text>
        {children ? <div className={styles.actions}>{children}</div> : null}
        {footer}
      </div>
    </div>
  )
}
