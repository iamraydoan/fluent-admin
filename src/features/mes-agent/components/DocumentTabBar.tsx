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
import type { ShellTab } from '@/stores/shell-store'
import { useSearch } from '@/context/search-provider'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { HEADER_GREY } from '../constants'
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
    cursor: 'pointer',
    // Tab bottom-right flare removed at the user's word (v13): it did
    // not look like the reference curve, so the tab keeps rounded top
    // corners only and a straight bottom-right edge.
  },
  // Inactive tab: same shape, but a flat grey fill (darker than the
  // strip so the tab shape still reads) and no shadow, so only the
  // active tab merges into the white block below.
  docTabInactive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#d9dcdf',
    border: '1px solid #c8c8c8',
    borderBottom: 'none',
    borderRadius: '8px 8px 0 0',
    padding: '8px 8px 8px 8px',
    height: '44px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    color: tokens.colorNeutralForeground1,
  },
  backButton: {
    alignSelf: 'center',
    marginBottom: '4px',
    flexShrink: 0,
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

export type DocumentTabBarProps = {
  tabs: ShellTab[]
  activeUrl: string
  onSelectTab: (url: string) => void
  onCloseTab: (url: string) => void
  onBack: () => void
  headerCollapsed: boolean
  onExpandHeader: () => void
}

// Multi-document tab strip, generalised from the MES single tab.
// One Back button at the start of the strip (goes to the preceding
// tab, or '/' when only one tab remains), then one tab per open
// document: the Home icon only on the first tab, every tab with its
// own Dismiss X. Active tab keeps the MES style (white, 8px top
// radius, #c8c8c8 border except the bottom); inactive tabs are flat
// grey but still readable. Right-hand icons keep the MES order:
// More, Scan, Search, Messages, account avatar.
export default function DocumentTabBar({
  tabs,
  activeUrl,
  onSelectTab,
  onCloseTab,
  onBack,
  headerCollapsed,
  onExpandHeader,
}: DocumentTabBarProps) {
  const styles = useStyles()
  const { setOpen } = useSearch()
  return (
    <div className={styles.docTabBar}>
      <Button
        appearance='transparent'
        size='small'
        className={styles.backButton}
        icon={<ChevronLeft24Regular />}
        aria-label='Back'
        onClick={onBack}
      />
      {tabs.map((tab, index) => {
        const isActive = tab.url === activeUrl
        return (
          <div
            key={tab.url}
            className={isActive ? styles.docTab : styles.docTabInactive}
            onClick={() => {
              if (!isActive) onSelectTab(tab.url)
            }}
            role='tab'
            aria-selected={isActive}
          >
            {index === 0 && <Home24Regular />}
            <Text weight={isActive ? 'semibold' : 'regular'}>{tab.title}</Text>
            <Button
              appearance='transparent'
              size='small'
              icon={<Dismiss24Regular />}
              aria-label={`Close tab ${tab.title}`}
              onClick={(e) => {
                e.stopPropagation()
                onCloseTab(tab.url)
              }}
            />
          </div>
        )
      })}
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
          onClick={() => setOpen(true)}
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
