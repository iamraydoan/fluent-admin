import { makeStyles, tokens } from '@fluentui/react-components'
import { Divider } from '@/components/ui/divider'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  header: {
    flexShrink: 0,
  },
  title: {
    display: 'block',
  },
  desc: {
    display: 'block',
    marginTop: tokens.spacingVerticalXS,
  },
  divider: {
    // Fluent Divider ships flex-grow: 1 by design (to fill a flex row).
    // This parent is a flex column, so without flexGrow: 0 the divider
    // stretches vertically to fill the card (measured 375px on Account)
    // instead of rendering as a 1px line.
    flexGrow: 0,
    flexShrink: 0,
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL,
  },
  scroll: {
    width: '100%',
    boxSizing: 'border-box',
  },
  inner: {
    maxWidth: '576px',
  },
})

type ContentSectionProps = {
  title: string
  desc: string
  children: React.JSX.Element
}

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={500} weight='semibold' className={styles.title}>
          {title}
        </Text>
        <Text size={300} className={styles.desc}>
          {desc}
        </Text>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.scroll}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  )
}
