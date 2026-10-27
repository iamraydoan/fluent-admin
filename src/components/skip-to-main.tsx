import { makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  link: {
    position: 'fixed',
    left: '16px',
    top: '-100px',
    zIndex: 999,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    textDecoration: 'none',
    borderRadius: tokens.borderRadiusMedium,
    // Nearest shadow token to 0 2px 8px: shadow8 keeps the 8px blur.
    boxShadow: tokens.shadow8,
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
