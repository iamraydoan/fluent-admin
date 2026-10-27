import { useRouterState } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  bar: {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '2px',
    zIndex: 1000,
    backgroundColor: tokens.colorNeutralForeground3,
    transitionProperty: 'width, opacity',
    transitionDuration: '300ms',
  },
})

export function NavigationProgress() {
  const styles = useStyles()
  const state = useRouterState()
  const pending = state.status === 'pending'

  return (
    <div
      aria-hidden='true'
      className={styles.bar}
      style={{ width: pending ? '70%' : '0', opacity: pending ? 1 : 0 }}
    />
  )
}
