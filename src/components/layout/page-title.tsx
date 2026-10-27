import { makeStyles, tokens } from '@fluentui/react-components'
import { ChevronUp24Regular, Settings20Regular } from '@fluentui/react-icons'
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
  titleIcon: {
    width: '20px',
    height: '20px',
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    // 3px is equidistant from Small 2px and Medium 4px; Medium chosen.
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
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
  // When omitted, no collapse button is rendered.
  onCollapse?: () => void
}

export default function PageTitle({
  title,
  state,
  onCollapse,
}: PageTitleProps) {
  const styles = useStyles()
  return (
    <CardHeader
      className={styles.pageTitle}
      image={
        <span className={styles.titleIcon} aria-hidden='true'>
          <Settings20Regular />
        </span>
      }
      header={
        <Text weight='medium'>{state ? `${title} (${state})` : title}</Text>
      }
      action={
        onCollapse ? (
          <Tooltip content='Collapse header' relationship='label'>
            <Button
              appearance='transparent'
              className={styles.collapseButton}
              icon={<ChevronUp24Regular />}
              aria-label='Collapse header'
              onClick={onCollapse}
            />
          </Tooltip>
        ) : undefined
      }
    />
  )
}
