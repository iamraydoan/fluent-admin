import { makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  link: {
    position: 'fixed',
    left: '16px',
    top: '-100px',
    zIndex: 999,
    backgroundColor: '#0f6cbd',
    color: '#ffffff',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    textDecoration: 'none',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    opacity: 0.95,
    ':focus': {
      top: '12px',
    },
    ':focus-visible': {
      top: '12px',
    },
  },
})

export function SkipToMain() {
  const styles = useStyles()
  return (
    <a className={styles.link} href='#content'>
      Skip to Main
    </a>
  )
}
