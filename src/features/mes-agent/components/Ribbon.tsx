import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  ArrowClockwise24Regular,
  Edit24Regular,
  MoreHorizontal24Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  ribbon: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: '8px 16px 8px 16px',
  },
  ribbonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px',
  },
  ribbonLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginTop: '0px',
  },
})

type RibbonProps = {
  notify: (message: string) => void
}

export default function Ribbon({ notify }: RibbonProps) {
  const styles = useStyles()
  return (
    <Toolbar className={styles.ribbon}>
      <div className={styles.ribbonGroup}>
        <ToolbarGroup>
          <ToolbarButton
            vertical
            appearance='subtle'
            icon={<ArrowClockwise24Regular />}
            onClick={() => notify('Refresh')}
          >
            Refresh
          </ToolbarButton>
          <ToolbarButton
            vertical
            appearance='subtle'
            icon={<Edit24Regular />}
            onClick={() => notify('Edit')}
          >
            Edit
          </ToolbarButton>
        </ToolbarGroup>
        <Text size={200} className={styles.ribbonLabel}>
          General
        </Text>
      </div>
      {/* Vertical divider between groups, as in the reference:
          tall, spanning most of the ribbon band, not the
          short default ToolbarDivider. */}
      <ToolbarDivider style={{ height: '64px', alignSelf: 'center' }} />
      <div className={styles.ribbonGroup}>
        <ToolbarGroup>
          <Menu>
            <MenuTrigger>
              <ToolbarButton
                vertical
                appearance='subtle'
                icon={<MoreHorizontal24Regular />}
              >
                More
              </ToolbarButton>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => notify('Save')}>Save</MenuItem>
                <MenuItem onClick={() => notify('Reset')}>Reset</MenuItem>
                <MenuItem onClick={() => notify('Publish To Runtime')}>
                  Publish To Runtime
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </ToolbarGroup>
        <Text size={200} className={styles.ribbonLabel}>
          Actions
        </Text>
      </div>
      {/* Trailing vertical divider after the last group, as in the reference. */}
      <ToolbarDivider style={{ height: '64px', alignSelf: 'center' }} />
    </Toolbar>
  )
}
