import { makeStyles, tokens } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import HeaderBlock from '@/components/layout/header-block'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
    minHeight: 0,
    flexDirection: 'column',
    gap: '8px',
  },
  card: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  center: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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

// Placeholder screen: same Coming Soon copy as the shared component,
// but laid out inside the unified shell — the shared ComingSoon renders
// a 100vh page of its own, which would overflow this page column, so
// its content is rendered here instead of reusing that component.
export function HelpCenter() {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <HeaderBlock
        title='Help Center'
        // No object tabs and no ribbon for the placeholder screen.
        ribbon={undefined}
      />
      <Card
        className={styles.card}
        style={{
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className={styles.center}>
          <h1 className={styles.title}>Coming Soon!</h1>
          <Text className={styles.muted}>
            This page has not been created yet. Stay tuned though!
          </Text>
        </div>
      </Card>
    </div>
  )
}
