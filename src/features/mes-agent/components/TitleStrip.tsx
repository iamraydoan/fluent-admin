import {
  Button,
  CardHeader,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { ChevronUp24Regular, Settings20Regular } from '@fluentui/react-icons'
import { AGENT_NAME, AGENT_STATE } from '../data'

const useStyles = makeStyles({
  titleStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    padding: '8px 16px',
    height: '40px',
    boxSizing: 'border-box',
  },
  titleIcon: {
    width: '20px',
    height: '20px',
    border: '1px solid #8a8a8a',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333333',
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

type TitleStripProps = {
  onCollapse: () => void
}

export default function TitleStrip({ onCollapse }: TitleStripProps) {
  const styles = useStyles()
  return (
    <CardHeader
      className={styles.titleStrip}
      image={
        <span className={styles.titleIcon} aria-hidden='true'>
          <Settings20Regular />
        </span>
      }
      header={
        <Text weight='medium'>
          {AGENT_NAME} ({AGENT_STATE})
        </Text>
      }
      action={
        <Button
          appearance='transparent'
          className={styles.collapseButton}
          icon={<ChevronUp24Regular />}
          aria-label='Collapse header'
          onClick={onCollapse}
        />
      }
    />
  )
}
