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
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

type DataTableRowActionsProps = {
  row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()
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
              setCurrentRow(row.original)
              setOpen('edit')
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            icon={<Delete20Regular />}
            onClick={() => {
              setCurrentRow(row.original)
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
