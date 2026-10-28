import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { format } from 'date-fns'
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import {
  Add20Regular,
  ArrowClockwise20Regular,
  Attach20Regular,
  Call20Regular,
  ChatMultiple20Regular,
  Compose20Regular,
  Dismiss20Regular,
  ImageAdd20Regular,
  MoreHorizontal20Regular,
  Search20Regular,
  Send20Regular,
  Video20Regular,
} from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Divider } from '@/components/ui/divider'
import { Input } from '@/components/ui/input'
import {
  MessageBar,
  MessageBarActions,
  MessageBarBody,
} from '@/components/ui/message-bar'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'
import ActionBar from '@/components/layout/action-bar'
import PageTop from '@/components/layout/page-top'
import { NewChat } from './components/new-chat'
import { type ChatUser, type Convo } from './data/chat-types'
// Fake Data
import { conversations } from './data/convo.json'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
    minHeight: 0,
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  card: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  section: {
    display: 'flex',
    height: '100%',
    gap: tokens.spacingHorizontalXXL,
  },
  leftPane: {
    display: 'flex',
    width: '288px',
    flexShrink: 0,
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  leftHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
  },
  inboxTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    height: '100%',
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalXS}`,
    boxSizing: 'border-box',
  },
  chatRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalS,
    textAlign: 'start',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
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
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
  },
  convoHeader: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    boxShadow: tokens.shadow4,
  },
  convoHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  convoHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
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
    gap: tokens.spacingVerticalL,
    overflowY: 'auto',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
  },
  dateLabel: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  // Exception: chat bubbles keep a 16px radius. They are message
  // bubbles, not a card/input/dialog surface, so the 4px Medium
  // standard for those surfaces does not apply here.
  bubbleOwn: {
    alignSelf: 'flex-end',
    maxWidth: '288px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: '16px 16px 0px 16px',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    overflowWrap: 'break-word',
    boxShadow: tokens.shadow4,
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    maxWidth: '288px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '16px 16px 16px 0px',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    overflowWrap: 'break-word',
    boxShadow: tokens.shadow4,
  },
  bubbleTime: {
    display: 'block',
    marginTop: tokens.spacingVerticalXS,
    fontSize: tokens.fontSizeBase200,
    fontStyle: 'italic',
    opacity: 0.85,
  },
  bubbleTimeOwn: {
    textAlign: 'end',
  },
  composer: {
    display: 'flex',
    flexShrink: 0,
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    paddingTop: '0px',
  },
  composerBox: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
  },
  composerActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
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
    gap: tokens.spacingVerticalXXL,
    minWidth: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
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
    gap: tokens.spacingVerticalS,
    textAlign: 'center',
  },
})

export function Chats() {
  const styles = useStyles()
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false)
  // ActionBar Refresh has no live data source behind it (the list is the
  // static demo JSON), so like the MES mock it only shows a notice.
  const [notice, setNotice] = useState('')
  // Composer draft (controlled input) and messages sent in this
  // session, keyed by conversation id. Sent messages are local-only:
  // they append to the open conversation's pane and are not sent
  // anywhere; switching conversations keeps each thread's local
  // messages, and a page reload drops them with the demo data.
  const [draft, setDraft] = useState('')
  const [localMessages, setLocalMessages] = useState<Record<string, Convo[]>>(
    {}
  )

  const sendDraft = () => {
    if (!selectedUser) return
    const text = draft.trim()
    if (!text) return
    const message: Convo = {
      sender: 'You',
      message: text,
      timestamp: new Date().toISOString(),
    }
    setLocalMessages((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] ?? []), message],
    }))
    setDraft('')
  }

  const openConversation = (user: { id: string }) => {
    // Look the full conversation up by id: the New Chat dialog only
    // passes users without messages, while inbox rows pass the full
    // conversation — both resolve to the same thread here.
    const conversation = conversations.find((c) => c.id === user.id)
    if (!conversation) return
    setSelectedUser(conversation)
    setDraft('')
    setCreateConversationDialog(false)
  }

  // Search is name-only, by design (documented choice, 2026-10-28):
  // the inbox list shows names + last-message previews, but filtering
  // matches fullName only, so a search term found only inside a
  // message body does not surface that conversation. Extending it to
  // message previews was considered and deliberately not done: with
  // the static demo data it would mostly surface stale 2024 threads
  // for body words, while name search stays predictable.
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
    <div className={styles.root}>
      <PageTop
        title='Chats'
        // No object tabs for Chats.
        actionBar={
          <ActionBar
            groups={[
              {
                label: 'General',
                actions: [
                  {
                    label: 'Refresh',
                    icon: <ArrowClockwise20Regular />,
                    onClick: () =>
                      setNotice('Refreshed (demo data, no API call)'),
                  },
                  {
                    label: 'New',
                    icon: <Compose20Regular />,
                    onClick: () => setCreateConversationDialog(true),
                  },
                ],
              },
            ]}
          />
        }
      />
      {notice && (
        <MessageBar intent='info'>
          <MessageBarBody>
            <Text size={300}>{notice}</Text>
          </MessageBarBody>
          <MessageBarActions>
            <Tooltip content='Dismiss' relationship='label'>
              <Button
                appearance='transparent'
                size='small'
                icon={<Dismiss20Regular />}
                onClick={() => setNotice('')}
                aria-label='Dismiss'
              />
            </Tooltip>
          </MessageBarActions>
        </MessageBar>
      )}
      <Card
        className={styles.card}
        style={{
          padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
          borderRadius: tokens.borderRadiusMedium,
          boxShadow: tokens.shadow2,
        }}
      >
        <section className={styles.section}>
          {/* Left Side */}
          <div className={styles.leftPane}>
            <div className={styles.leftHeader}>
              <div className={styles.inboxTitle}>
                <Text size={600} weight='semibold'>
                  Inbox
                </Text>
                <ChatMultiple20Regular />
              </div>

              <Tooltip content='New message' relationship='label'>
                <Button
                  appearance='subtle'
                  icon={<Compose20Regular />}
                  aria-label='New message'
                  onClick={() => setCreateConversationDialog(true)}
                />
              </Tooltip>
            </div>

            <Input
              contentBefore={<Search20Regular />}
              // Name-only search, by design (see the filter comment
              // below): the placeholder says so, so users do not
              // expect a message-body match.
              placeholder='Search by name'
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
                    <Button
                      type='button'
                      appearance='transparent'
                      // mergeClasses (not string concatenation): Fluent
                      // Button merges its className via Griffel, and a
                      // concatenated pair of makeStyles classes trips
                      // its "multiple atomic identifiers" warning.
                      className={mergeClasses(
                        styles.chatRow,
                        selectedUser?.id === id && styles.chatRowSelected
                      )}
                      onClick={() => openConversation(chatUsr)}
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
                    </Button>
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
                  <Tooltip content='Video call' relationship='label'>
                    <Button
                      appearance='subtle'
                      icon={<Video20Regular />}
                      aria-label='Video call'
                      onClick={() => toast.info('Video call (local only)')}
                    />
                  </Tooltip>
                  <Tooltip content='Voice call' relationship='label'>
                    <Button
                      appearance='subtle'
                      icon={<Call20Regular />}
                      aria-label='Voice call'
                      onClick={() => toast.info('Voice call (local only)')}
                    />
                  </Tooltip>
                  <Tooltip content='More options' relationship='label'>
                    <Button
                      appearance='subtle'
                      icon={<MoreHorizontal20Regular />}
                      aria-label='More options'
                      onClick={() => toast.info('More options (local only)')}
                    />
                  </Tooltip>
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
                {/* Messages sent this session, after the demo groups:
                    the demo timestamps are 2024, so today's section
                    sorts last, and local messages render in send
                    order (chronological), not reversed like the demo
                    groups above. */}
                {(localMessages[selectedUser.id] ?? []).length > 0 && (
                  <Fragment>
                    <div className={styles.dateLabel}>
                      <Text size={200}>
                        {format(new Date(), 'd MMM, yyyy')}
                      </Text>
                    </div>
                    {localMessages[selectedUser.id].map((msg, index) => (
                      <div
                        key={`${msg.sender}-${msg.timestamp}-${index}`}
                        className={styles.bubbleOwn}
                      >
                        {msg.message}{' '}
                        <span
                          className={`${styles.bubbleTime} ${styles.bubbleTimeOwn}`}
                        >
                          {format(msg.timestamp, 'h:mm a')}
                        </span>
                      </div>
                    ))}
                  </Fragment>
                )}
              </div>
              <form
                className={styles.composer}
                onSubmit={(e) => {
                  e.preventDefault()
                  sendDraft()
                }}
              >
                <div className={styles.composerBox}>
                  <div className={styles.composerActions}>
                    <Tooltip content='Add attachment' relationship='label'>
                      <Button
                        appearance='subtle'
                        type='button'
                        icon={<Add20Regular />}
                        aria-label='Add attachment'
                        onClick={() =>
                          toast.info('Add attachment (local only)')
                        }
                      />
                    </Tooltip>
                    <Tooltip content='Add image' relationship='label'>
                      <Button
                        appearance='subtle'
                        type='button'
                        icon={<ImageAdd20Regular />}
                        aria-label='Add image'
                        onClick={() => toast.info('Add image (local only)')}
                      />
                    </Tooltip>
                    <Tooltip content='Attach file' relationship='label'>
                      <Button
                        appearance='subtle'
                        type='button'
                        icon={<Attach20Regular />}
                        aria-label='Attach file'
                        onClick={() => toast.info('Attach file (local only)')}
                      />
                    </Tooltip>
                  </div>
                  <label className={styles.composerLabel}>
                    <span hidden>Chat Text Box</span>
                    <Input
                      type='text'
                      placeholder='Type your messages...'
                      value={draft}
                      onChange={(_e, data) => setDraft(data.value)}
                      // Borderless inside the composer box (the box
                      // already carries the border); the style lands
                      // on the Fluent Input root.
                      style={{
                        flex: '1',
                        minWidth: '0',
                        border: 'none',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                      }}
                    />
                  </label>
                  <Tooltip content='Send message' relationship='label'>
                    <Button
                      appearance='subtle'
                      type='submit'
                      icon={<Send20Regular />}
                      aria-label='Send message'
                    />
                  </Tooltip>
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
      </Card>
      <NewChat
        users={users}
        onOpenChange={setCreateConversationDialog}
        open={createConversationDialogOpened}
        onOpenConversation={openConversation}
      />
    </div>
  )
}
