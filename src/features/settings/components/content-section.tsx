import { makeStyles } from '@fluentui/react-components'
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
    marginTop: '4px',
  },
  divider: {
    flexShrink: 0,
    marginTop: '16px',
    marginBottom: '16px',
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
