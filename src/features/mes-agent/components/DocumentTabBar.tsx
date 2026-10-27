import { makeStyles, tokens } from '@fluentui/react-components'
import {
  BarcodeScanner20Regular,
  Chat20Regular,
  ChevronDown20Regular,
  ChevronDown24Regular,
  ChevronLeft24Regular,
  Dismiss24Regular,
  Home24Regular,
  Search20Regular,
} from '@fluentui/react-icons'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { HEADER_GREY } from '../constants'
import { AGENT_NAME } from '../data'
import { ACCOUNT } from '../menu-data'

const useStyles = makeStyles({
  docTabBar: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    // 4px top + 44px tab = 48px strip, as in the reference; 8px right
    // padding, because the main area's 8px right margin already
    // contributes 8px, so the avatar's right edge still sits ~16px
    // from the viewport edge, as in the reference.
    padding: '4px 8px 0 16px',
    backgroundColor: HEADER_GREY,
  },
  // Soft rounded top corners, clean 1px border, no square edge.
  // The border stops at the bottom so the tab's white fill merges into
  // the white block below it, exactly like the reference tab.
  docTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #c8c8c8',
    borderBottom: 'none',
    borderRadius: '8px 8px 0 0',
    boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.06)',
    padding: '8px 8px 8px 8px',
    height: '44px',
    boxSizing: 'border-box',
    // Tab bottom-right flare removed at the user's word (v13): it did
    // not look like the reference curve, so the tab keeps rounded top
    // corners only and a straight bottom-right edge.
  },
  // Even, tight spacing, 20px icons, centred, padded from the edge.
  docTabRight: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '8px',
    paddingRight: '0px',
    flexShrink: 0,
  },
  topIconButton: {
    minWidth: '32px',
    width: '32px',
    height: '32px',
    padding: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground2,
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '0px',
    flexShrink: 0,
  },
})

type DocumentTabBarProps = {
  headerCollapsed: boolean
  onExpandHeader: () => void
}

export default function DocumentTabBar({
  headerCollapsed,
  onExpandHeader,
}: DocumentTabBarProps) {
  const styles = useStyles()
  return (
    <div className={styles.docTabBar}>
      <div className={styles.docTab}>
        <Button
          appearance='transparent'
          size='small'
          icon={<ChevronLeft24Regular />}
          aria-label='Back'
        />
        <Home24Regular />
        <Text weight='semibold'>{AGENT_NAME}</Text>
        <Button
          appearance='transparent'
          size='small'
          icon={<Dismiss24Regular />}
          aria-label='Close tab'
        />
      </div>
      <div className={styles.docTabRight}>
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<ChevronDown20Regular />}
          aria-label='More options'
        />
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<BarcodeScanner20Regular />}
          aria-label='Scan'
        />
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<Search20Regular />}
          aria-label='Search'
        />
        <Button
          appearance='transparent'
          className={styles.topIconButton}
          icon={<Chat20Regular />}
          aria-label='Messages'
        />
        {/* Account avatar, from the same account data the original
            menu used (see menu-data.ts ACCOUNT). The demo's generic
            blue 'A' agent avatar is replaced here on purpose: the
            user asked for account info in the header instead of
            duplicating it in the menu, and the agent identity is
            already in the document tab and title strip text. The
            warning-triangle badge belonged to that agent avatar, so
            it is removed with it, not carried over to a user account.
            The original avatar image path is kept, with initials
            fallback: that file does not exist in this repo's public/
            folder today, so initials render until the asset is added.
            Name + email are the accessible label and tooltip. */}
        <div
          className={styles.avatarWrap}
          title={`${ACCOUNT.name} (${ACCOUNT.email})`}
        >
          <Avatar
            name={ACCOUNT.name}
            initials={ACCOUNT.initials}
            image={{ src: ACCOUNT.avatar }}
            size={32}
            aria-label={`${ACCOUNT.name} (${ACCOUNT.email})`}
          />
        </div>
        {headerCollapsed && (
          <Button
            appearance='transparent'
            className={styles.topIconButton}
            icon={<ChevronDown24Regular />}
            aria-label='Expand header'
            onClick={onExpandHeader}
          />
        )}
      </div>
    </div>
  )
}
