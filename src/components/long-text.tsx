import { useRef, useState } from 'react'
import { makeStyles } from '@fluentui/react-components'

const useStyles = makeStyles({
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

type LongTextProps = {
  children: React.ReactNode
  /** Accepted for API compatibility with existing callers; no longer applied. */
  className?: string
  /** Accepted for API compatibility with existing callers; no longer applied. */
  contentClassName?: string
}

export function LongText({ children }: LongTextProps) {
  const styles = useStyles()
  const ref = useRef<HTMLDivElement>(null)
  const [isOverflown, setIsOverflown] = useState(false)

  // Use ref callback to check overflow when element is mounted
  const refCallback = (node: HTMLDivElement | null) => {
    ref.current = node
    if (node && checkOverflow(node)) {
      queueMicrotask(() => setIsOverflown(true))
    }
  }

  return (
    <div
      ref={refCallback}
      className={styles.truncate}
      title={isOverflown && typeof children === 'string' ? children : undefined}
    >
      {children}
    </div>
  )
}

const checkOverflow = (textContainer: HTMLDivElement | null) => {
  if (textContainer) {
    return (
      textContainer.offsetHeight < textContainer.scrollHeight ||
      textContainer.offsetWidth < textContainer.scrollWidth
    )
  }
  return false
}
