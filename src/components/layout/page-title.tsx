import { makeStyles, tokens } from '@fluentui/react-components'
import { ChevronDown20Regular, ChevronUp20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { CardHeader } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'

const useStyles = makeStyles({
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    height: '40px',
    boxSizing: 'border-box',
  },
  collapseButton: {
    minWidth: '32px',
    width: '32px',
    height: '32px',
    padding: '0px',
    color: tokens.colorNeutralForeground2,
  },
})

export type PageTitleProps = {
  title: string
  // Optional state, rendered as "title (state)", e.g. "Title (State)".
  state?: string
  // ActionBar toggle, NOT a whole-header collapse: when true the
  // ActionBar row above this title is hidden, but PageTabs, this
  // title row and the page content below all stay visible (user
  // correction 2026-10-28: closing here closes only the ActionBar).
  // When omitted (screens with no ActionBar), no toggle button is
  // rendered — there is nothing to toggle.
  actionBarCollapsed?: boolean
  onToggleActionBar?: () => void
}

export default function PageTitle({
  title,
  state,
  actionBarCollapsed = false,
  onToggleActionBar,
}: PageTitleProps) {
  const styles = useStyles()
  return (
    // Thinning (2026-10-28): the title row carries NO icon. The old
    // bordered gear box was removed rather than replaced with a
    // per-screen icon: PageTop has no per-screen icon data, so a
    // gear on every screen would mislead (it implied a settings
    // action that does not exist), and inventing one icon per
    // screen here would be decoration, not information.
    <CardHeader
      className={styles.pageTitle}
      header={
        <Text weight='medium'>{state ? `${title} (${state})` : title}</Text>
      }
      action={
        onToggleActionBar ? (
          <Tooltip
            content={
              actionBarCollapsed ? 'Expand action bar' : 'Collapse action bar'
            }
            relationship='label'
          >
            <Button
              appearance='transparent'
              className={styles.collapseButton}
              icon={
                actionBarCollapsed ? (
                  <ChevronDown20Regular />
                ) : (
                  <ChevronUp20Regular />
                )
              }
              aria-label={
                actionBarCollapsed ? 'Expand action bar' : 'Collapse action bar'
              }
              onClick={onToggleActionBar}
            />
          </Tooltip>
        ) : undefined
      }
    />
  )
}
