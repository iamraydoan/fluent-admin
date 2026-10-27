import { makeStyles } from '@fluentui/react-components'
import { MailAdd20Regular, PersonAdd20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '8px',
  },
})

export function UsersPrimaryButtons() {
  const styles = useStyles()
  const { setOpen } = useUsers()
  return (
    <div className={styles.root}>
      <Button
        appearance='secondary'
        icon={<MailAdd20Regular />}
        onClick={() => setOpen('invite')}
      >
        Invite User
      </Button>
      <Button
        appearance='primary'
        icon={<PersonAdd20Regular />}
        onClick={() => setOpen('add')}
      >
        Add User
      </Button>
    </div>
  )
}
