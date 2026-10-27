import { Link } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import { Text } from '@/components/ui/text'

// Plain app title link. The old version carried a sidebar toggle that
// depended on the shadcn sidebar context; the toggle now lives in the
// sidebar header itself (see AppSidebar).
const useStyles = makeStyles({
  link: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.25',
    textDecoration: 'none',
    color: 'inherit',
    padding: '4px 8px',
  },
})

export function AppTitle() {
  const styles = useStyles()
  return (
    <Link to='/' className={styles.link}>
      <Text weight='bold' size={400}>
        Shadcn-Admin
      </Text>
      <Text size={200}>Vite + ShadcnUI</Text>
    </Link>
  )
}
