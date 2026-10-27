import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { makeStyles } from '@fluentui/react-components'
import {
  ArrowSort24Regular,
  CheckmarkCircle24Regular,
  Alert24Regular,
  Payment24Regular,
  SignOut24Regular,
  Sparkle24Regular,
} from '@fluentui/react-icons'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
  triggerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    textAlign: 'left',
    padding: '4px 8px',
    boxSizing: 'border-box',
  },
  userText: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
    lineHeight: '1.25',
  },
})

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
  collapsed: boolean
}

export function NavUser({ user, collapsed }: NavUserProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [signOutOpen, setSignOutOpen] = useState(false)

  return (
    <>
      <Menu>
        <MenuTrigger>
          <Button appearance='transparent'>
            <span className={styles.triggerRow}>
              <Avatar
                name={user.name}
                image={{ src: user.avatar, alt: user.name }}
                size={32}
              />
              {!collapsed && (
                <>
                  <span className={styles.userText}>
                    <Text weight='semibold' size={300}>
                      {user.name}
                    </Text>
                    <Text size={200}>{user.email}</Text>
                  </span>
                  <ArrowSort24Regular />
                </>
              )}
            </span>
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem icon={<Sparkle24Regular />}>Upgrade to Pro</MenuItem>
            <MenuItem
              icon={<CheckmarkCircle24Regular />}
              onClick={() => navigate({ to: '/settings/account' })}
            >
              Account
            </MenuItem>
            <MenuItem
              icon={<Payment24Regular />}
              onClick={() => navigate({ to: '/settings' })}
            >
              Billing
            </MenuItem>
            <MenuItem
              icon={<Alert24Regular />}
              onClick={() => navigate({ to: '/settings/notifications' })}
            >
              Notifications
            </MenuItem>
            <MenuItem
              icon={<SignOut24Regular />}
              onClick={() => setSignOutOpen(true)}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  )
}
