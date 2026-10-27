import { type Table } from '@tanstack/react-table'
import { Checkmark20Regular, Options20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
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
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
