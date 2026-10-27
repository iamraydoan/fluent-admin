import { Fragment, type ReactElement } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  Edit24Regular,
  MoreHorizontal24Regular,
} from '@fluentui/react-icons'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Text } from '@/components/ui/text'
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
} from '@/components/ui/toolbar'

const useStyles = makeStyles({
  ribbon: {
    display: 'flex',
    gap: tokens.spacingHorizontalXXXL,
    alignItems: 'flex-start',
    backgroundColor: tokens.colorNeutralBackground1,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL} ${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
  },
  ribbonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px',
  },
  ribbonLabel: {
    // Kept at 11px: equidistant between Base100 (10px) and Base200
    // (12px); tokenising would change the label size.
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginTop: '0px',
  },
})

export type RibbonAction = {
  label: string
  // Icon element (e.g. <ArrowClockwise24Regular />), rendered inside
  // the button.
  icon?: ReactElement
  onClick?: () => void
  // When set, the action renders as a menu trigger with these items
  // instead of a plain button.
  menuItems?: { label: string; onClick?: () => void }[]
}

export type RibbonGroup = {
  label: string
  actions: RibbonAction[]
}

export type RibbonProps = {
  notify?: (message: string) => void
  // When omitted, the MES default groups are kept (General:
  // Refresh/Edit, Actions: More with Save/Reset/Publish To Runtime),
  // so MES renders unchanged without passing groups.
  groups?: RibbonGroup[]
}

const DEFAULT_GROUPS = (notify?: (message: string) => void): RibbonGroup[] => [
  {
    label: 'General',
    actions: [
      {
        label: 'Refresh',
        icon: <ArrowClockwise24Regular />,
        onClick: () => notify?.('Refresh'),
      },
      {
        label: 'Edit',
        icon: <Edit24Regular />,
        onClick: () => notify?.('Edit'),
      },
    ],
  },
  {
    label: 'Actions',
    actions: [
      {
        label: 'More',
        icon: <MoreHorizontal24Regular />,
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

export default function Ribbon({ notify, groups }: RibbonProps) {
  const styles = useStyles()
  const resolved = groups ?? DEFAULT_GROUPS(notify)
  return (
    <Toolbar className={styles.ribbon}>
      {resolved.map((group) => (
        <Fragment key={group.label}>
          <div className={styles.ribbonGroup}>
            <ToolbarGroup>
              {group.actions.map((action) =>
                action.menuItems ? (
                  <Menu key={action.label}>
                    <MenuTrigger>
                      <ToolbarButton
                        vertical
                        appearance='subtle'
                        icon={action.icon}
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
                  >
                    {action.label}
                  </ToolbarButton>
                )
              )}
            </ToolbarGroup>
            <Text size={200} className={styles.ribbonLabel}>
              {group.label}
            </Text>
          </div>
          {/* Vertical divider between groups, as in the reference:
              tall, spanning most of the ribbon band, not the
              short default ToolbarDivider. A trailing divider after
              the last group, as in the reference. */}
          <ToolbarDivider
            key={`${group.label}-divider`}
            style={{ height: '64px', alignSelf: 'center' }}
          />
        </Fragment>
      ))}
    </Toolbar>
  )
}
