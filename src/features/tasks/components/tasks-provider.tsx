import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  // Bulk-delete dialog open state, owned by the provider so the
  // ActionBar Delete action (which owns no table instance) can
  // open the existing multi-delete flow. DataTableBulkActions
  // renders that dialog and ORs this flag with its own local
  // delete button state; closing the dialog clears both.
  bulkDeleteOpen: boolean
  requestBulkDelete: () => void
  setBulkDeleteOpen: (open: boolean) => void
}

const TasksContext = React.createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  return (
    <TasksContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        bulkDeleteOpen,
        requestBulkDelete: () => setBulkDeleteOpen(true),
        setBulkDeleteOpen,
      }}
    >
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
