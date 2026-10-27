import { type Table } from '@tanstack/react-table'
import { makeStyles } from '@fluentui/react-components'
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  // Entity Types pattern: fully right-aligned, no first/last buttons and
  // no direct page-number jumps.
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '16px',
    flexWrap: 'wrap',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
})

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  /** Accepted for API compatibility with existing callers; no longer applied. */
  className?: string
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const styles = useStyles()
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const totalRecords = table.getFilteredRowModel().rows.length

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <Text>Rows per Page:</Text>
        <Select
          aria-label='Rows per page'
          value={`${table.getState().pagination.pageSize}`}
          onChange={(_, data) => {
            table.setPageSize(Number(data.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </option>
          ))}
        </Select>
      </div>

      <Text>
        Page {currentPage} of {totalPages} ({totalRecords} Records)
      </Text>

      <div className={styles.group}>
        <Button
          appearance='outline'
          shape='square'
          size='small'
          aria-label='Go to previous page'
          icon={<ChevronLeft20Regular />}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <Button
          appearance='outline'
          shape='square'
          size='small'
          aria-label='Go to next page'
          icon={<ChevronRight20Regular />}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
      </div>
    </div>
  )
}
