import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { ArrowDown20Regular, ArrowUp20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@/components/ui/dialog'
import { Text } from '@/components/ui/text'
import { getColumnHeaderLabel } from './column-label'
import { getOriginalColumnOrder } from './data-table-state'

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  label: {
    flex: '1',
    minWidth: 0,
  },
  note: {
    color: tokens.colorNeutralForeground2,
  },
})

type DataTableColumnOptionsDialogProps<TData> = {
  table: Table<TData>
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Column Options wizard. Draft-only: checking, unchecking and
 * reordering change local draft state and touch nothing until
 * Apply, which writes visibility (via the table's controlled
 * visibility handler, so it persists like the quick toggles) and
 * column order in one step. Cancel discards the draft. This is
 * deliberately different from the quick View menu toggles, which
 * apply instantly. Only columns already defined on the table are
 * listed; no new column properties are invented here.
 *
 * Non-hideable columns (select, first link column, actions) are
 * shown locked: they cannot be hidden or moved past, so a
 * hideable row cannot be reordered above a pinned/locked column.
 */
export function DataTableColumnOptionsDialog<TData>({
  table,
  open,
  onOpenChange,
}: DataTableColumnOptionsDialogProps<TData>) {
  const styles = useStyles()
  // Draft seeds from the table at mount. The parent renders this
  // dialog only while it is open, so mounting always starts from
  // the table's current order and visibility, and closing
  // unmounts (discarding an unapplied draft) — no seeding effect.
  const [draftOrder, setDraftOrder] = useState<string[]>(() =>
    table.getAllColumns().map((column) => column.id)
  )
  const [draftVisibility, setDraftVisibility] = useState<
    Record<string, boolean>
  >(() => {
    const visibility: Record<string, boolean> = {}
    for (const column of table.getAllColumns()) {
      if (column.getCanHide()) visibility[column.id] = column.getIsVisible()
    }
    return visibility
  })

  const columnsById = new Map(
    table.getAllColumns().map((column) => [column.id, column])
  )

  const move = (index: number, direction: -1 | 1) => {
    setDraftOrder((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      // Never move past a locked (non-hideable) column.
      const neighbour = columnsById.get(next[target])
      if (neighbour && !neighbour.getCanHide()) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  // Show all in the wizard restores BOTH draft visibility and the
  // original column order (draft-only until Apply, like all wizard
  // changes): resetting visibility alone would leave a reordered
  // column reordered after Apply.
  const showAll = () => {
    setDraftVisibility((prev) => {
      const next = { ...prev }
      for (const id of Object.keys(next)) next[id] = true
      return next
    })
    setDraftOrder(getOriginalColumnOrder(table))
  }

  const apply = () => {
    const visibility = { ...table.getState().columnVisibility }
    for (const [id, visible] of Object.entries(draftVisibility)) {
      visibility[id] = visible
    }
    table.setColumnVisibility(visibility)
    table.setColumnOrder(draftOrder)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Column options</DialogTitle>
          <DialogContent>
            <div className={styles.list}>
              <Text size={300} className={styles.note}>
                Changes apply only when you click Apply. Cancel discards them.
              </Text>
              {draftOrder.map((id, index) => {
                const column = columnsById.get(id)
                if (!column) return null
                const label = getColumnHeaderLabel(column)
                const canHide = column.getCanHide()
                const visible = canHide ? (draftVisibility[id] ?? true) : true
                return (
                  <div key={id} className={styles.row}>
                    <Checkbox
                      checked={visible}
                      disabled={!canHide}
                      aria-label={`Show ${label} column`}
                      onChange={(_, data) =>
                        setDraftVisibility((prev) => ({
                          ...prev,
                          [id]: data.checked === true,
                        }))
                      }
                    />
                    <Text className={styles.label}>{label}</Text>
                    {!canHide && <Text size={300}>Locked</Text>}
                    <Button
                      appearance='subtle'
                      size='small'
                      icon={<ArrowUp20Regular />}
                      aria-label={`Move ${label} up`}
                      disabled={
                        !canHide ||
                        index === 0 ||
                        !columnsById.get(draftOrder[index - 1])?.getCanHide()
                      }
                      onClick={() => move(index, -1)}
                    />
                    <Button
                      appearance='subtle'
                      size='small'
                      icon={<ArrowDown20Regular />}
                      aria-label={`Move ${label} down`}
                      disabled={
                        !canHide ||
                        index === draftOrder.length - 1 ||
                        !columnsById.get(draftOrder[index + 1])?.getCanHide()
                      }
                      onClick={() => move(index, 1)}
                    />
                  </div>
                )
              })}
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance='outline' size='small' onClick={showAll}>
              Show all columns
            </Button>
            <Button
              appearance='subtle'
              size='small'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button appearance='primary' size='small' onClick={apply}>
              Apply
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
