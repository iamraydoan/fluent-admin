import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { QuestionCircle20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'

const useStyles = makeStyles({
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  content: {
    position: 'absolute',
    zIndex: 100,
    bottom: 'calc(100% + 4px)',
    left: '0',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    minWidth: '240px',
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
})

type LearnMoreProps = {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  /** Accepted for API compatibility with existing callers; no longer applied. */
  contentProps?: { side?: string; align?: string; className?: string }
  /** Accepted for API compatibility with existing callers; no longer applied. */
  triggerProps?: { className?: string }
}

export function LearnMore({
  children,
  open,
  onOpenChange,
  defaultOpen = false,
}: LearnMoreProps) {
  const styles = useStyles()
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = open ?? internalOpen

  const toggle = () => {
    const next = !isOpen
    if (onOpenChange) onOpenChange(next)
    else setInternalOpen(next)
  }

  return (
    <span className={styles.wrapper}>
      <Tooltip content='Learn more' relationship='label'>
        <Button
          appearance='outline'
          shape='circular'
          size='small'
          aria-label='Learn more'
          icon={<QuestionCircle20Regular />}
          onClick={toggle}
        />
      </Tooltip>
      {isOpen && <span className={styles.content}>{children}</span>}
    </span>
  )
}
