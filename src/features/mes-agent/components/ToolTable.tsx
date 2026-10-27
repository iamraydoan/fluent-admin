import { Fragment } from 'react'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ChevronDown24Regular,
  ChevronRight24Regular,
  Eye24Filled,
} from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/table'
import { Text } from '@/components/ui/text'
import { TOOL_GROUPS } from '../data'

const useStyles = makeStyles({
  tableWrap: { padding: '8px 0 8px 0' },
  tableHeaderRow: { backgroundColor: '#eeeeee' },
  headerCell: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    padding: '4px 16px',
    height: '27px',
    borderRight: '1px solid #e0e0e0',
  },
  headerCellCenter: {
    textAlign: 'center',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    padding: '4px 8px',
    height: '27px',
  },
  headerCellCenterDivider: {
    textAlign: 'center',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    padding: '4px 8px',
    height: '27px',
    borderRight: '1px solid #e0e0e0',
  },
  centerCell: { textAlign: 'center', padding: '4px 8px', height: '26px' },
  centerCellDivider: {
    textAlign: 'center',
    padding: '4px 8px',
    height: '26px',
    borderRight: '1px solid #e0e0e0',
  },
  // Tool text sits 27px beyond the group link, as in the reference:
  // group link offset is ~41px from the card left, so tool padding
  // gives ~68px. Vertical dividers are cell right borders, since
  // Fluent Table has none of its own.
  toolCell: {
    padding: '4px 8px 4px 68px',
    height: '26px',
    borderRight: '1px solid #e0e0e0',
  },
  groupCell: { padding: '4px 8px', height: '26px' },
  groupRow: { backgroundColor: '#ffffff' },
  diamond: {
    display: 'inline-block',
    width: '9px',
    height: '9px',
    transform: 'rotate(45deg)',
    border: `1.5px solid ${tokens.colorBrandForeground1}`,
    marginRight: '8px',
    flexShrink: 0,
  },
  groupButton: { paddingLeft: '8px', height: '24px' },
})

type ToolTableProps = {
  expanded: Record<string, boolean>
  onToggleGroup: (name: string) => void
  notify: (message: string) => void
}

export default function ToolTable({
  expanded,
  onToggleGroup,
  notify,
}: ToolTableProps) {
  const styles = useStyles()
  return (
    <div className={styles.tableWrap}>
      <Table>
        <colgroup>
          <col style={{ width: '36.3%' }} />
          <col style={{ width: '31.8%' }} />
          <col style={{ width: '31.9%' }} />
        </colgroup>
        <TableHeader>
          <TableRow className={styles.tableHeaderRow}>
            <TableHeaderCell className={styles.headerCell}>
              TOOL
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCellCenterDivider}>
              DESCRIPTION
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCellCenter}>
              DEFERRED
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TOOL_GROUPS.map((group) => {
            const isOpen = expanded[group.name] ?? false
            return (
              <Fragment key={group.name}>
                <TableRow className={styles.groupRow}>
                  <TableCell colSpan={3} className={styles.groupCell}>
                    <Button
                      appearance='transparent'
                      className={styles.groupButton}
                      icon={
                        isOpen ? (
                          <ChevronDown24Regular />
                        ) : (
                          <ChevronRight24Regular />
                        )
                      }
                      onClick={() => onToggleGroup(group.name)}
                    >
                      <span className={styles.diamond} aria-hidden='true' />
                      <Link>
                        {group.name} ({group.tools.length} Tools)
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
                {isOpen &&
                  group.tools.map((tool) => (
                    <TableRow key={tool.name}>
                      <TableCell className={styles.toolCell}>
                        {tool.name}
                      </TableCell>
                      <TableCell className={styles.centerCellDivider}>
                        <Button
                          appearance='transparent'
                          size='small'
                          icon={<Eye24Filled />}
                          aria-label={`View ${tool.name}`}
                          onClick={() => notify(`View tool ${tool.name}`)}
                        />
                      </TableCell>
                      <TableCell className={styles.centerCell}>
                        <Text
                          size={400}
                          weight='bold'
                          style={{ color: tokens.colorNeutralForeground3 }}
                        >
                          {tool.deferred ? '✓' : '✕'}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
