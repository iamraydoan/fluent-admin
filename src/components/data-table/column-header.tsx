import { type Column } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ArrowDown20Regular,
  ArrowSort20Regular,
  ArrowUp20Regular,
  Dismiss20Regular,
  EyeOff20Regular,
} from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
})

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
  /** Accepted for API compatibility with existing callers; no longer applied. */
  className?: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const styles = useStyles()
  if (!column.getCanSort()) {
    return <Text>{title}</Text>
  }

  const sorted = column.getIsSorted()

  return (
    <div className={styles.row}>
      <Menu>
        <MenuTrigger>
          <Button
            appearance='subtle'
            size='small'
            icon={
              sorted === 'desc' ? (
                <ArrowDown20Regular />
              ) : sorted === 'asc' ? (
                <ArrowUp20Regular />
              ) : (
                <ArrowSort20Regular />
              )
            }
          >
            {title}
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<ArrowUp20Regular />}
              onClick={() => column.toggleSorting(false)}
            >
              Asc
            </MenuItem>
            <MenuItem
              icon={<ArrowDown20Regular />}
              onClick={() => column.toggleSorting(true)}
            >
              Desc
            </MenuItem>
            {sorted && (
              <MenuItem
                icon={<Dismiss20Regular />}
                onClick={() => column.clearSorting()}
              >
                Clear sort
              </MenuItem>
            )}
            {column.getCanHide() && (
              <MenuItem
                icon={<EyeOff20Regular />}
                onClick={() => column.toggleVisibility(false)}
              >
                Hide
              </MenuItem>
            )}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  )
}
