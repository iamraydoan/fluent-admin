import { makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  main: {
    padding: `${tokens.spacingVerticalXXL} ${tokens.spacingHorizontalL}`,
  },
  mainFixed: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  mainConstrained: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    maxWidth: '1280px',
  },
})

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({ fixed, className, fluid, ...props }: MainProps) {
  const styles = useStyles()
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={`${styles.main} ${fixed ? styles.mainFixed : ''} ${!fluid ? styles.mainConstrained : ''} ${className ?? ''}`}
      {...props}
    />
  )
}
