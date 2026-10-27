import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  Add20Regular,
  Attach20Regular,
  Call20Regular,
  ChatMultiple20Regular,
  Compose20Regular,
  ImageAdd20Regular,
  MoreHorizontal20Regular,
  Search20Regular,
  Send20Regular,
  Video20Regular,
} from '@fluentui/react-icons'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NewChat } from './components/new-chat'
import { type ChatUser, type Convo } from './data/chat-types'
// Fake Data
import { conversations } from './data/convo.json'

const useStyles = makeStyles({
  section: {
    display: 'flex',
    height: '100%',
    gap: '24px',
  },
  leftPane: {
    display: 'flex',
    width: '288px',
    flexShrink: 0,
    flexDirection: 'column',
    gap: '8px',
  },
  leftHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  inboxTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    height: '100%',
    overflowY: 'auto',
    padding: '4px',
    boxSizing: 'border-box',
  },
  chatRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    gap: '8px',
    textAlign: 'start',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    padding: '8px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  chatRowSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  rowText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  lastMsg: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    color: tokens.colorNeutralForeground3,
  },
  rightPane: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
  },
  convoHeader: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    boxShadow: tokens.shadow4,
  },
  convoHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  convoHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  titleText: {
    display: 'block',
    maxWidth: '128px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: tokens.colorNeutralForeground3,
  },
  messages: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
    padding: '16px',
  },
  dateLabel: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  bubbleOwn: {
    alignSelf: 'flex-end',
    maxWidth: '288px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: '16px 16px 0px 16px',
    padding: '8px 12px',
    overflowWrap: 'break-word',
    boxShadow: tokens.shadow4,
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    maxWidth: '288px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '16px 16px 16px 0px',
    padding: '8px 12px',
    overflowWrap: 'break-word',
    boxShadow: tokens.shadow4,
  },
  bubbleTime: {
    display: 'block',
    marginTop: '4px',
    fontSize: '12px',
    fontStyle: 'italic',
    opacity: 0.85,
  },
  bubbleTimeOwn: {
    textAlign: 'end',
  },
  composer: {
    display: 'flex',
    flexShrink: 0,
    gap: '8px',
    padding: '16px',
    paddingTop: '0px',
  },
  composerBox: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    gap: '8px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '4px 8px',
  },
  composerActions: {
    display: 'flex',
    gap: '4px',
  },
  composerInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    height: '32px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  composerLabel: {
    display: 'flex',
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  emptyPane: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    minWidth: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  emptyIcon: {
    display: 'flex',
    width: '64px',
    height: '64px',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '50%',
  },
  emptyText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'center',
  },
})

export function Chats() {
  const styles = useStyles()
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false)

  // Filtered data based on the search query
  const filteredChatList = conversations.filter(({ fullName }) =>
    fullName.toLowerCase().includes(search.trim().toLowerCase())
  )

  const currentMessage = selectedUser?.messages.reduce(
    (acc: Record<string, Convo[]>, obj) => {
      const key = format(obj.timestamp, 'd MMM, yyyy')

      // Create an array for the category if it doesn't exist
      if (!acc[key]) {
        acc[key] = []
      }

      // Push the current object to the array
      acc[key].push(obj)

      return acc
    },
    {}
  )

  const users = conversations.map(({ messages, ...user }) => user)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <section className={styles.section}>
          {/* Left Side */}
          <div className={styles.leftPane}>
            <div className={styles.leftHeader}>
              <div className={styles.inboxTitle}>
                <Text size={600} weight='bold'>
                  Inbox
                </Text>
                <ChatMultiple20Regular />
              </div>

              <Button
                appearance='subtle'
                icon={<Compose20Regular />}
                aria-label='New message'
                onClick={() => setCreateConversationDialog(true)}
              />
            </div>

            <Input
              contentBefore={<Search20Regular />}
              placeholder='Search chat...'
              value={search}
              onChange={(_e, data) => setSearch(data.value)}
            />

            <div className={styles.list}>
              {filteredChatList.map((chatUsr) => {
                const { id, profile, username, messages, fullName } = chatUsr
                const lastConvo = messages[0]
                const lastMsg =
                  lastConvo.sender === 'You'
                    ? `You: ${lastConvo.message}`
                    : lastConvo.message
                return (
                  <Fragment key={id}>
                    <button
                      type='button'
                      className={`${styles.chatRow} ${selectedUser?.id === id ? styles.chatRowSelected : ''}`}
                      onClick={() => setSelectedUser(chatUsr)}
                    >
                      <Avatar
                        name={fullName}
                        image={{ src: profile, alt: username }}
                      />
                      <div className={styles.rowText}>
                        <Text weight='semibold'>{fullName}</Text>
                        <Text size={200} className={styles.lastMsg}>
                          {lastMsg}
                        </Text>
                      </div>
                    </button>
                    <Divider />
                  </Fragment>
                )
              })}
            </div>
          </div>

          {/* Right Side */}
          {selectedUser ? (
            <div className={styles.rightPane}>
              {/* Top Part */}
              <div className={styles.convoHeader}>
                {/* Left */}
                <div className={styles.convoHeaderLeft}>
                  <Avatar
                    name={selectedUser.fullName}
                    image={{
                      src: selectedUser.profile,
                      alt: selectedUser.username,
                    }}
                    size={40}
                  />
                  <div>
                    <Text weight='semibold'>{selectedUser.fullName}</Text>
                    <Text size={200} className={styles.titleText}>
                      {selectedUser.title}
                    </Text>
                  </div>
                </div>

                {/* Right */}
                <div className={styles.convoHeaderRight}>
                  <Button
                    appearance='subtle'
                    icon={<Video20Regular />}
                    aria-label='Video call'
                  />
                  <Button
                    appearance='subtle'
                    icon={<Call20Regular />}
                    aria-label='Voice call'
                  />
                  <Button
                    appearance='subtle'
                    icon={<MoreHorizontal20Regular />}
                    aria-label='More options'
                  />
                </div>
              </div>

              {/* Conversation: oldest at top, newest at bottom */}
              <div className={styles.messages}>
                {currentMessage &&
                  Object.keys(currentMessage).map((key) => (
                    <Fragment key={key}>
                      <div className={styles.dateLabel}>
                        <Text size={200}>{key}</Text>
                      </div>
                      {[...currentMessage[key]].reverse().map((msg, index) => (
                        <div
                          key={`${msg.sender}-${msg.timestamp}-${index}`}
                          className={
                            msg.sender === 'You'
                              ? styles.bubbleOwn
                              : styles.bubbleOther
                          }
                        >
                          {msg.message}{' '}
                          <span
                            className={`${styles.bubbleTime} ${msg.sender === 'You' ? styles.bubbleTimeOwn : ''}`}
                          >
                            {format(msg.timestamp, 'h:mm a')}
                          </span>
                        </div>
                      ))}
                    </Fragment>
                  ))}
              </div>
              <form
                className={styles.composer}
                onSubmit={(e) => e.preventDefault()}
              >
                <div className={styles.composerBox}>
                  <div className={styles.composerActions}>
                    <Button
                      appearance='subtle'
                      type='button'
                      icon={<Add20Regular />}
                      aria-label='Add attachment'
                    />
                    <Button
                      appearance='subtle'
                      type='button'
                      icon={<ImageAdd20Regular />}
                      aria-label='Add image'
                    />
                    <Button
                      appearance='subtle'
                      type='button'
                      icon={<Attach20Regular />}
                      aria-label='Attach file'
                    />
                  </div>
                  <label className={styles.composerLabel}>
                    <span hidden>Chat Text Box</span>
                    <input
                      type='text'
                      placeholder='Type your messages...'
                      className={styles.composerInput}
                    />
                  </label>
                  <Button
                    appearance='subtle'
                    type='submit'
                    icon={<Send20Regular />}
                    aria-label='Send message'
                  />
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.emptyPane}>
              <div className={styles.emptyIcon}>
                <ChatMultiple20Regular />
              </div>
              <div className={styles.emptyText}>
                <Text size={500} weight='semibold'>
                  Your messages
                </Text>
                <Text size={300}>Send a message to start a chat.</Text>
              </div>
              <Button
                appearance='primary'
                onClick={() => setCreateConversationDialog(true)}
              >
                Send message
              </Button>
            </div>
          )}
        </section>
        <NewChat
          users={users}
          onOpenChange={setCreateConversationDialog}
          open={createConversationDialogOpened}
        />
      </Main>
    </>
  )
}
