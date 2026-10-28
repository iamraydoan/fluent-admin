import { Fragment, type ReactElement } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowClockwise20Regular,
  Edit20Regular,
  MoreHorizontal20Regular,
} from '@fluentui/react-icons'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Text } from '@/components/ui/text'
import { Toolbar, ToolbarButton, ToolbarGroup } from '@/components/ui/toolbar'

const useStyles = makeStyles({
  actionBar: {
    display: 'flex',
    // Tight, token-based rhythm: 12px on each side of a divider gives
    // 25px between groups (12 + 1px divider + 12), down from 65px
    // (32 + 1 + 32) before. Left/right padding stays L (16px) so the
    // first button aligns with the Page Tabs and Page Title rows.
    gap: tokens.spacingHorizontalM,
    alignItems: 'stretch',
    backgroundColor: tokens.colorNeutralBackground1,
    // Reference spacing: the group label hugs the bottom of the bar
    // rather than the button labels above it, so bottom padding is
    // XS (4px) while the label gap below is S (8px).
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalXS} ${tokens.spacingHorizontalL}`,
  },
  actionBarGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px',
  },
  // Divider only between groups, never trailing after the last one.
  // A plain stroke line stretched to the bar's content height, so it
  // always matches the group height instead of a fixed 64px.
  actionBarDivider: {
    width: tokens.strokeWidthThin,
    backgroundColor: tokens.colorNeutralStroke1,
    alignSelf: 'stretch',
    flexShrink: 0,
  },
  // Uniform button width so icons line up in a neat row even when
  // labels differ in length (Refresh vs Add). 64px is button
  // geometry, not a spacing token. Labels are regular weight
  // (thinning 2026-10-28: semibold stacked with 20px icons read
  // too heavy); hover is an explicit light pale-gray rounded box
  // (the reference Edit hover), not the default subtle wash alone.
  actionButton: {
    minWidth: '64px',
    fontWeight: tokens.fontWeightRegular,
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover,
    },
  },
  actionBarLabel: {
    // Ws6: tokenised to Base200 (12px, +1px). No 11px token exists;
    // 12px is chosen over 10px so group labels stay readable.
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalS,
  },
})

export type ActionBarAction = {
  label: string
  // Icon element (e.g. <ArrowClockwise20Regular />), rendered inside
  // the button.
  icon?: ReactElement
  onClick?: () => void
  // When set, the action renders as a menu trigger with these items
  // instead of a plain button.
  menuItems?: { label: string; onClick?: () => void }[]
  // State-driven visibility/enablement, supplied by the screen that
  // owns the state (never hardcoded in the bar itself): disabled
  // renders a disabled ToolbarButton, hidden skips the action
  // entirely, and a group whose actions are all hidden renders
  // nothing (not even its label or divider).
  disabled?: boolean
  hidden?: boolean
}

export type ActionBarGroup = {
  label: string
  actions: ActionBarAction[]
}

export type ActionBarProps = {
  notify?: (message: string) => void
  // When omitted, the MES default groups are kept (General:
  // Refresh/Edit, Actions: More with Save/Reset/Publish To Runtime),
  // so MES renders unchanged without passing groups.
  groups?: ActionBarGroup[]
}

const DEFAULT_GROUPS = (
  notify?: (message: string) => void
): ActionBarGroup[] => [
  {
    label: 'General',
    actions: [
      {
        label: 'Refresh',
        icon: <ArrowClockwise20Regular />,
        onClick: () => notify?.('Refresh'),
      },
      {
        label: 'Edit',
        icon: <Edit20Regular />,
        onClick: () => notify?.('Edit'),
      },
    ],
  },
  {
    label: 'Actions',
    actions: [
      {
        label: 'More',
        icon: <MoreHorizontal20Regular />,
        menuItems: [
          { label: 'Save', onClick: () => notify?.('Save') },
          { label: 'Reset', onClick: () => notify?.('Reset') },
          {
            label: 'Publish To Runtime',
            onClick: () => notify?.('Publish To Runtime'),
          },
        ],
      },
    ],
  },
]

export default function ActionBar({ notify, groups }: ActionBarProps) {
  const styles = useStyles()
  const resolved = groups ?? DEFAULT_GROUPS(notify)
  // Hidden actions are filtered before rendering, so a group with
  // all actions hidden disappears completely (label + divider).
  const visibleGroups = resolved
    .map((group) => ({
      ...group,
      actions: group.actions.filter((action) => !action.hidden),
    }))
    .filter((group) => group.actions.length > 0)
  return (
    <Toolbar className={styles.actionBar}>
      {visibleGroups.map((group, index) => (
        <Fragment key={group.label}>
          {/* Divider only between groups: a single-group bar (most
              screens) has no dangling separator at its right end. */}
          {index > 0 && (
            <div aria-hidden='true' className={styles.actionBarDivider} />
          )}
          <div className={styles.actionBarGroup}>
            <ToolbarGroup>
              {group.actions.map((action) =>
                action.menuItems ? (
                  <Menu key={action.label}>
                    <MenuTrigger>
                      <ToolbarButton
                        vertical
                        appearance='subtle'
                        icon={action.icon}
                        disabled={action.disabled}
                        className={styles.actionButton}
                      >
                        {action.label}
                      </ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                      <MenuList>
                        {action.menuItems.map((item) => (
                          <MenuItem key={item.label} onClick={item.onClick}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                ) : (
                  <ToolbarButton
                    key={action.label}
                    vertical
                    appearance='subtle'
                    icon={action.icon}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={styles.actionButton}
                  >
                    {action.label}
                  </ToolbarButton>
                )
              )}
            </ToolbarGroup>
            <Text size={200} className={styles.actionBarLabel}>
              {group.label}
            </Text>
          </div>
        </Fragment>
      ))}
    </Toolbar>
  )
}
