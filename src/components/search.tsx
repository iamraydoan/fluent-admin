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
    // Exception: 2px radius is kept for this small inline kbd hint,
    // not a card/input/dialog surface, so the standard radius does
    // not apply here.
    borderRadius: tokens.borderRadiusSmall,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalSNudge}`,
    // Ws6: tokenised to Base200 (12px, +1px). No 11px token exists;
    // 12px is chosen over 10px so the kbd hint stays readable.
    fontSize: tokens.fontSizeBase200,
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
