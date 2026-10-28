import { type Row } from '@tanstack/react-table'
import {
  Delete20Regular,
  Edit20Regular,
  MoreHorizontal20Regular,
} from '@fluentui/react-icons'
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
          shape='rounded'
          icon={<MoreHorizontal20Regular />}
          aria-label='Open menu'
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<Edit20Regular />}
            onClick={() => {
              setCurrentRow(task)
              setOpen('update')
            }}
          >
            Edit
          </MenuItem>
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
