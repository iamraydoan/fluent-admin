import { useEffect, useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { toast } from '@/lib/toast'
import { downloadCsv, type CsvColumn } from '@/components/data-table'
import { priorities, statuses } from '../data/data'
import { type Task } from '../data/schema'
import { TasksMassUpdateDialog } from './tasks-mass-update-dialog'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'
import { useTasks } from './tasks-provider'

// Bulk actions live in the screen ActionBar, not in a floating
// toolbar: this component owns only the dialogs and the export
// handler, and reports a controller to the screen through
// onBulkChange. There is deliberately no key handler here: pressing
// Escape must never clear the selection — it only closes a menu or
// dialog (Fluent's own behaviour), leaving the selection intact.
// The old instant status/priority menus and the simulated
// selected-only export are removed: status/priority go through the
// Mass Update dialog (choose + Preview + Update), and Export
// downloads all records as CSV.
export type TasksBulkController = {
  selectedCount: number
  requestMassUpdate: () => void
  exportCsv: () => void
}

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
  onBulkChange?: (controller: TasksBulkController) => void
}

export function DataTableBulkActions<TData>({
  table,
  onBulkChange,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showMassUpdate, setShowMassUpdate] = useState(false)
  // Bumped on every Mass Update request so the dialog remounts with
  // fresh choose-step state (see TasksMassUpdateDialog).
  const [massUpdateKey, setMassUpdateKey] = useState(0)
  const { bulkDeleteOpen, setBulkDeleteOpen } = useTasks()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  // Selection identity, not just the count: swapping one selected
  // row for another keeps the count but must refresh the
  // controller's handlers, otherwise they would act on stale rows.
  const selectionKey = selectedRows.map((row) => row.id).join(',')
  const visibleKey = table
    .getVisibleLeafColumns()
    .map((column) => column.id)
    .join(',')

  const handleExportCsv = () => {
    const rows = table.getFilteredRowModel().rows
    const isVisible = (id: string) =>
      table.getColumn(id)?.getIsVisible() ?? false
    const all: { id: string; title: string; values: string[] }[] = [
      {
        id: 'title',
        title: 'TITLE',
        values: rows.map((row) => (row.original as Task).title),
      },
      {
        id: 'status',
        title: 'STATUS',
        values: rows.map((row) => {
          const status = statuses.find(
            ({ value }) => value === (row.original as Task).status
          )
          return status ? status.label : (row.original as Task).status
        }),
      },
      {
        id: 'priority',
        title: 'PRIORITY',
        values: rows.map((row) => {
          const priority = priorities.find(
            ({ value }) => value === (row.original as Task).priority
          )
          return priority ? priority.label : (row.original as Task).priority
        }),
      },
    ]
    // Visible columns only. The selection and row-actions columns
    // are never exported (they are not in this list at all), and
    // the TASK identifier column is excluded as an ID-only column.
    const columns: CsvColumn[] = all.filter((column) => isVisible(column.id))
    const count = downloadCsv('tasks.csv', columns)
    toast.success(`Exported ${count} tasks to CSV`)
  }

  // Report the controller after every render that changes the
  // selection or column visibility, so the ActionBar buttons always
  // act on the current selection.
  useEffect(() => {
    onBulkChange?.({
      selectedCount,
      requestMassUpdate: () => {
        setMassUpdateKey((key) => key + 1)
        setShowMassUpdate(true)
      },
      exportCsv: handleExportCsv,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionKey, visibleKey])

  return (
    <>
      <TasksMultiDeleteDialog
        // Either the ActionBar Delete action (via the provider flag)
        // or a local request opens the same dialog; closing it
        // clears both sources.
        open={showDeleteConfirm || bulkDeleteOpen}
        onOpenChange={(open) => {
          setShowDeleteConfirm(open)
          if (!open) setBulkDeleteOpen(false)
        }}
        table={table}
      />

      <TasksMassUpdateDialog
        key={massUpdateKey}
        table={table}
        open={showMassUpdate}
        onOpenChange={setShowMassUpdate}
      />
    </>
  )
}
