import { makeStyles, tokens } from '@fluentui/react-components'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  page: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center',
  },
  title: {
    margin: '0',
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: '1.2',
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
})

export function ComingSoon() {
  const styles = useStyles()
  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <h1 className={styles.title}>Coming Soon!</h1>
        <Text className={styles.muted}>
          This page has not been created yet. Stay tuned though!
        </Text>
      </div>
    </div>
  )
}
