import { makeStyles, tokens } from '@fluentui/react-components'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import PageTop from '@/components/layout/page-top'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
    minHeight: 0,
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
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
    gap: tokens.spacingVerticalS,
    textAlign: 'center',
  },
  title: {
    margin: '0',
    // Tokenised choice: Hero900 (40px) over Hero800 (32px). The old
    // 36px sat equidistant (4px from either); growing to the hero
    // size keeps this a landing title rather than shrinking it to a
    // section heading. No PageTabs and no ActionBar on this screen.
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    lineHeight: tokens.lineHeightHero900,
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
      <PageTop
        title='Help Center'
        // No object tabs and no action bar for the placeholder screen.
        actionBar={undefined}
      />
      <Card
        className={styles.card}
        style={{
          padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalXXL}`,
          borderRadius: tokens.borderRadiusXLarge,
          boxShadow: tokens.shadow2,
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
