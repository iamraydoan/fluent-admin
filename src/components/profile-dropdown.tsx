import { useNavigate } from '@tanstack/react-router'
import { makeStyles, tokens } from '@fluentui/react-components'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Text } from '@/components/ui/text'
import { SignOutDialog } from '@/components/sign-out-dialog'

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '8px 12px',
  },
  email: {
    color: tokens.colorNeutralForeground3,
  },
})

export function ProfileDropdown() {
  const styles = useStyles()
  const navigate = useNavigate()
  const [open, setOpen] = useDialogState()

  return (
    <>
      <Menu>
        <MenuTrigger>
          <Button
            appearance='transparent'
            shape='circular'
            aria-label='Profile'
          >
            <Avatar
              size={32}
              name='satnaing'
              initials='SN'
              image={{ src: '/avatars/01.png', alt: '@shadcn' }}
            />
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <div className={styles.header}>
            <Text weight='semibold'>satnaing</Text>
            <Text size={200} className={styles.email}>
              satnaingdev@gmail.com
            </Text>
          </div>
          <Divider />
          <MenuList>
            <MenuItem onClick={() => navigate({ to: '/settings' })}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate({ to: '/settings' })}>
              Billing
            </MenuItem>
            <MenuItem onClick={() => navigate({ to: '/settings' })}>
              Settings
            </MenuItem>
            <MenuItem>New Team</MenuItem>
            <Divider />
            <MenuItem onClick={() => setOpen(true)}>Sign out</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
