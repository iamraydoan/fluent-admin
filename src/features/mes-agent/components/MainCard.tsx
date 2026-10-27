import {
  Button,
  Card,
  CardHeader,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  ArrowClockwise20Regular,
  MoreVertical20Regular,
  MoreVertical24Regular,
  Table24Regular,
} from '@fluentui/react-icons'
import { DETAIL_CARDS, INSTRUCTIONS, TOTAL_TOOLS } from '../data'
import type { SectionId } from '../types'
import ToolTable from './ToolTable'

const useStyles = makeStyles({
  card: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  // Small, tight inner toolbar (Fluent Toolbar, size small).
  // More is a grouped column with the tiny grey "Actions" label centred
  // underneath it, matching the reference and the ribbon grouping.
  sectionToolbar: {
    padding: '8px 16px 0px 16px',
  },
  innerMoreGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0px',
  },
  innerMoreLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  sectionTitleRow: {
    padding: '16px 16px 0px 16px',
  },
  detailCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    padding: '16px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    gap: '8px',
    padding: '4px 0',
  },
  fieldLabel: { textAlign: 'right', color: tokens.colorNeutralForeground3 },
  bodyPadding: { padding: '16px' },
})

type MainCardProps = {
  objectTab: string
  sectionId: SectionId
  expanded: Record<string, boolean>
  onToggleGroup: (name: string) => void
  notify: (message: string) => void
}

export default function MainCard({
  objectTab,
  sectionId,
  expanded,
  onToggleGroup,
  notify,
}: MainCardProps) {
  const styles = useStyles()
  return (
    <Card
      className={styles.card}
      style={{
        padding: '0px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
      }}
    >
      {objectTab === 'Details' ? (
        <>
          {sectionId === 'mcp-servers' && (
            <>
              <Toolbar size='small' className={styles.sectionToolbar}>
                {/* Inner icons are 20px, smaller than the ribbon's 24px, as in the reference. */}
                <ToolbarButton
                  appearance='subtle'
                  icon={<ArrowClockwise20Regular />}
                  onClick={() => notify('Refresh MCP tools')}
                >
                  Refresh
                </ToolbarButton>
                <ToolbarDivider
                  style={{ height: '40px', alignSelf: 'center' }}
                />
                <div className={styles.innerMoreGroup}>
                  <Menu>
                    <MenuTrigger>
                      <ToolbarButton
                        appearance='subtle'
                        icon={<MoreVertical20Regular />}
                      >
                        More
                      </ToolbarButton>
                    </MenuTrigger>
                    <MenuPopover>
                      <MenuList>
                        <MenuItem onClick={() => notify('Save MCP tools')}>
                          Save
                        </MenuItem>
                        <MenuItem onClick={() => notify('Reset MCP tools')}>
                          Reset
                        </MenuItem>
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                  <Text size={200} className={styles.innerMoreLabel}>
                    Actions
                  </Text>
                </div>
                {/* Trailing vertical divider after More, as in the reference. */}
                <ToolbarDivider
                  style={{ height: '40px', alignSelf: 'center' }}
                />
              </Toolbar>
              <div style={{ flexShrink: 0 }}>
                <Divider />
              </div>
              <CardHeader
                className={styles.sectionTitleRow}
                header={
                  <Text weight='medium' size={400}>
                    MCP Server Tools ({TOTAL_TOOLS})
                  </Text>
                }
                action={
                  <span style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      appearance='transparent'
                      size='small'
                      icon={<Table24Regular />}
                      aria-label='Change layout'
                    />
                    <Button
                      appearance='transparent'
                      size='small'
                      icon={<MoreVertical24Regular />}
                      aria-label='More table options'
                    />
                  </span>
                }
              />
            </>
          )}
          {sectionId === 'details' && (
            <div className={styles.detailCards}>
              {DETAIL_CARDS.map((card) => (
                <Card
                  key={card.title}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <CardHeader
                    header={<Text weight='semibold'>{card.title}</Text>}
                  />
                  {card.fields.map((field) => (
                    <div key={field.label} className={styles.fieldRow}>
                      <Text size={300} className={styles.fieldLabel}>
                        {field.label}:
                      </Text>
                      <Text size={300}>{field.value}</Text>
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          )}
          {sectionId === 'instructions' && (
            <div className={styles.bodyPadding}>
              <Text weight='semibold' block style={{ marginBottom: '8px' }}>
                Instructions
              </Text>
              <Text block>{INSTRUCTIONS}</Text>
            </div>
          )}
          {sectionId === 'attachments' && (
            <div className={styles.bodyPadding}>
              <Text weight='semibold' block style={{ marginBottom: '8px' }}>
                Attachments
              </Text>
              <Text>No attachments.</Text>
            </div>
          )}
          {sectionId === 'mcp-servers' && (
            <ToolTable
              expanded={expanded}
              onToggleGroup={onToggleGroup}
              notify={notify}
            />
          )}
        </>
      ) : (
        <div className={styles.bodyPadding}>
          <Text weight='semibold' block style={{ marginBottom: '8px' }}>
            {objectTab}
          </Text>
          <Text>No {objectTab.toLowerCase()} in this mock.</Text>
        </div>
      )}
    </Card>
  )
}
