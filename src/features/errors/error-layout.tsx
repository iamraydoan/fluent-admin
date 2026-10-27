import { makeStyles, tokens } from '@fluentui/react-components'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100svh',
    width: '100%',
    // Themed surface so error pages are not a white page with dark
    // text in dark mode (or vice versa): light resolves to #ffffff,
    // dark to the dark surface. Works under the ThemedErrorShell
    // provider in __root.tsx; without a provider the var is invalid
    // and the background stays transparent, as before.
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  inner: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalS,
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
    boxSizing: 'border-box',
  },
  code: {
    // Kept at 112px / 1.1: far above the largest Fluent size token
    // (Hero1000 68px); no token is within 2px.
    fontSize: '112px',
    lineHeight: '1.1',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
  },
  description: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
  },
  actions: {
    marginTop: tokens.spacingVerticalXXL,
    display: 'flex',
    gap: tokens.spacingHorizontalL,
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
