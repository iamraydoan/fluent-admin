import { useState } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Checkmark20Regular, Dismiss20Regular } from '@fluentui/react-icons'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'
import { type ChatUser } from '../data/chat-types'

type User = Omit<ChatUser, 'messages'>

type NewChatProps = {
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  selectedRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  selectedLabel: {
    color: tokens.colorNeutralForeground3,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxHeight: '320px',
    overflowY: 'auto',
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
  },
  userRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    textAlign: 'start',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.borderRadiusSmall,
    padding: '6px 8px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    minWidth: 0,
  },
  userNames: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  username: {
    color: tokens.colorNeutralForeground3,
  },
  empty: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalS}`,
    color: tokens.colorNeutralForeground3,
  },
})

export function NewChat({ users, onOpenChange, open }: NewChatProps) {
  const styles = useStyles()
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [query, setQuery] = useState('')

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user])
    } else {
      handleRemoveUser(user.id)
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    // Reset selected users when dialog closes
    if (!newOpen) {
      setSelectedUsers([])
      setQuery('')
    }
  }

  const filteredUsers = users.filter((user) =>
    `${user.fullName} ${user.username}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(_e, data) => handleOpenChange(data.open)}
    >
      <DialogSurface>
        <DialogTitle>New message</DialogTitle>
        <DialogBody>
          <div className={styles.content}>
            <div className={styles.selectedRow}>
              <Text size={300} className={styles.selectedLabel}>
                To:
              </Text>
              {selectedUsers.map((user) => (
                <Badge key={user.id}>
                  {user.fullName}
                  <Tooltip
                    content={`Remove ${user.fullName}`}
                    relationship='label'
                  >
                    <Button
                      appearance='subtle'
                      size='small'
                      icon={<Dismiss20Regular />}
                      aria-label={`Remove ${user.fullName}`}
                      onClick={() => handleRemoveUser(user.id)}
                    />
                  </Tooltip>
                </Badge>
              ))}
            </div>
            <Input
              placeholder='Search people...'
              value={query}
              onChange={(_e, data) => setQuery(data.value)}
            />
            <div className={styles.list}>
              {filteredUsers.length === 0 && (
                <div className={styles.empty}>
                  <Text size={300}>No people found.</Text>
                </div>
              )}
              {filteredUsers.map((user) => (
                <Button
                  key={user.id}
                  type='button'
                  appearance='transparent'
                  className={styles.userRow}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className={styles.userInfo}>
                    <Avatar
                      name={user.fullName}
                      image={{
                        src: user.profile || '/placeholder.svg',
                        alt: user.fullName,
                      }}
                      size={32}
                    />
                    <div className={styles.userNames}>
                      <Text size={300} weight='semibold'>
                        {user.fullName}
                      </Text>
                      <Text size={200} className={styles.username}>
                        {user.username}
                      </Text>
                    </div>
                  </div>

                  {selectedUsers.find((u) => u.id === user.id) && (
                    <Checkmark20Regular />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button
            appearance='primary'
            onClick={() => showSubmittedData(selectedUsers)}
            disabled={selectedUsers.length === 0}
          >
            Chat
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  )
}
