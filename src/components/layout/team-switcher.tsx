import * as React from 'react'
import { makeStyles } from '@fluentui/react-components'
import { Text } from '@/components/ui/text'

// The old TeamSwitcher was a dropdown over shadcn Menu parts. It is
// simplified to a plain title row for the first team: no dropdown, no
// switching. Props are kept so existing imports still compile.
const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.25',
  },
})

type TeamSwitcherProps = {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const styles = useStyles()
  const activeTeam = teams[0]
  if (!activeTeam) return null
  const Logo = activeTeam.logo
  return (
    <div className={styles.row}>
      <Logo />
      <span className={styles.text}>
        <Text weight='semibold' size={300}>
          {activeTeam.name}
        </Text>
        <Text size={200}>{activeTeam.plan}</Text>
      </span>
    </div>
  )
}
