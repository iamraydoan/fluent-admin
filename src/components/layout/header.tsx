import { useEffect, useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Divider } from '@/components/ui/divider'

const useStyles = makeStyles({
  header: {
    height: '64px',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #edebe9',
    boxSizing: 'border-box',
  },
  headerFixed: {
    position: 'sticky',
    top: '0px',
    zIndex: 50,
  },
  headerShadow: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  },
  inner: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: '0px 16px',
    boxSizing: 'border-box',
  },
})

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const styles = useStyles()
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  // The sidebar toggle used to live here (shadcn SidebarTrigger). It
  // now lives in the sidebar header itself; Header only renders its
  // children (page actions, search, profile) after a divider.
  return (
    <header
      className={`${styles.header} ${fixed ? styles.headerFixed : ''} ${offset > 10 && fixed ? styles.headerShadow : ''} ${className ?? ''}`}
      {...props}
    >
      <div className={styles.inner}>
        <Divider vertical />
        {children}
      </div>
    </header>
  )
}
