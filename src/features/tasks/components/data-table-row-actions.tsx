import { type Row } from '@tanstack/react-table'
import { Delete20Regular, MoreHorizontal20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { taskSchema } from '../data/schema'
import { useTasks } from './tasks-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useTasks()

  return (
    <Menu>
      <MenuTrigger>
        <Button
          appearance='subtle'
          size='small'
          icon={<MoreHorizontal20Regular />}
          aria-label='Open menu'
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem
            onClick={() => {
              setCurrentRow(task)
              setOpen('update')
            }}
          >
            Edit
          </MenuItem>
          <MenuItem disabled>Make a copy</MenuItem>
          <MenuItem disabled>Favorite</MenuItem>
          <MenuItem
            icon={<Delete20Regular />}
            onClick={() => {
              setCurrentRow(task)
              setOpen('delete')
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}
