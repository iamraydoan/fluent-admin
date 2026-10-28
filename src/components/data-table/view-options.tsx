import { type Table } from '@tanstack/react-table'
import { Checkmark20Regular, Options20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import type { TableDensity } from './data-table-state'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
  density?: TableDensity
  onDensityChange?: (density: TableDensity) => void
}

export function DataTableViewOptions<TData>({
  table,
  density,
  onDensityChange,
}: DataTableViewOptionsProps<TData>) {
  return (
    <Menu>
      <MenuTrigger>
        <Button appearance='outline' size='small' icon={<Options20Regular />}>
          View
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem disabled>Toggle columns</MenuItem>
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <MenuItem
                  key={column.id}
                  icon={
                    column.getIsVisible() ? <Checkmark20Regular /> : undefined
                  }
                  onClick={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  {column.id}
                </MenuItem>
              )
            })}
          {density && onDensityChange && (
            <>
              <MenuDivider />
              <MenuItem disabled>Density</MenuItem>
              <MenuItem
                icon={
                  density === 'compact' ? <Checkmark20Regular /> : undefined
                }
                onClick={() => onDensityChange('compact')}
              >
                Compact
              </MenuItem>
              <MenuItem
                icon={
                  density === 'standard' ? <Checkmark20Regular /> : undefined
                }
                onClick={() => onDensityChange('standard')}
              >
                Standard
              </MenuItem>
            </>
          )}
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
