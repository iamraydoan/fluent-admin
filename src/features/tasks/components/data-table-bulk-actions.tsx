import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import {
  ArrowDownload20Regular,
  ArrowSwap20Regular,
  ArrowUpload20Regular,
  Delete20Regular,
} from '@fluentui/react-icons'
import { toast } from '@/lib/toast'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/components/ui/menu'
import { Tooltip } from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = async (status: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.info('Updating status...')
    await sleep(2000)
    table.resetRowSelection()
    toast.success(
      `Status updated to "${status}" for ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}.`
    )
  }

  const handleBulkPriorityChange = async (priority: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.info('Updating priority...')
    await sleep(2000)
    table.resetRowSelection()
    toast.success(
      `Priority updated to "${priority}" for ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}.`
    )
  }

  const handleBulkExport = async () => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.info('Exporting tasks...')
    await sleep(2000)
    table.resetRowSelection()
    toast.success(
      `Exported ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''} to CSV.`
    )
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='task'>
        <Menu>
          <MenuTrigger>
            <Tooltip content='Update status' relationship='label'>
              <Button
                appearance='outline'
                size='small'
                shape='circular'
                icon={<ArrowUpload20Regular />}
                aria-label='Update status'
              />
            </Tooltip>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {statuses.map((status) => {
                const StatusIcon = status.icon
                return (
                  <MenuItem
                    key={status.value}
                    icon={<StatusIcon />}
                    onClick={() => handleBulkStatusChange(status.value)}
                  >
                    {status.label}
                  </MenuItem>
                )
              })}
            </MenuList>
          </MenuPopover>
        </Menu>

        <Menu>
          <MenuTrigger>
            <Tooltip content='Update priority' relationship='label'>
              <Button
                appearance='outline'
                size='small'
                shape='circular'
                icon={<ArrowSwap20Regular />}
                aria-label='Update priority'
              />
            </Tooltip>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {priorities.map((priority) => {
                const PriorityIcon = priority.icon
                return (
                  <MenuItem
                    key={priority.value}
                    icon={<PriorityIcon />}
                    onClick={() => handleBulkPriorityChange(priority.value)}
                  >
                    {priority.label}
                  </MenuItem>
                )
              })}
            </MenuList>
          </MenuPopover>
        </Menu>

        <Tooltip content='Export tasks' relationship='label'>
          <Button
            appearance='outline'
            size='small'
            shape='circular'
            onClick={() => handleBulkExport()}
            icon={<ArrowDownload20Regular />}
            aria-label='Export tasks'
          />
        </Tooltip>

        <Tooltip content='Delete selected tasks' relationship='label'>
          <Button
            appearance='primary'
            size='small'
            shape='circular'
            onClick={() => setShowDeleteConfirm(true)}
            icon={<Delete20Regular />}
            aria-label='Delete selected tasks'
          />
        </Tooltip>
      </BulkActionsToolbar>

      <TasksMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
