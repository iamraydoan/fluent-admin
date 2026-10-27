import { makeStyles, tokens } from '@fluentui/react-components'
import { Search20Regular } from '@fluentui/react-icons'
import { useSearch } from '@/context/search-provider'
import { Button } from './ui/button'
import { Text } from './ui/text'

const useStyles = makeStyles({
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    width: '100%',
  },
  kbd: {
    marginLeft: 'auto',
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: '2px 6px',
    // Kept at 11px: equidistant between Base100 (10px) and Base200
    // (12px); tokenising would change the kbd hint size.
    fontSize: '11px',
  },
})

export function Search({
  placeholder = 'Search',
  className: _className,
  ...props
}: React.ComponentProps<'button'> & { placeholder?: string }) {
  const styles = useStyles()
  const { setOpen } = useSearch()
  void _className
  return (
    <Button
      {...props}
      appearance='outline'
      aria-keyshortcuts='Meta+K Control+K'
      onClick={() => setOpen(true)}
    >
      <span className={styles.buttonContent}>
        <Search20Regular aria-hidden='true' />
        <Text>{placeholder}</Text>
        <kbd className={styles.kbd}>⌘K</kbd>
      </span>
    </Button>
  )
}
