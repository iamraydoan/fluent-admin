import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ChevronDoubleLeft20Regular,
  ChevronDoubleRight20Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons'
import { getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  select: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    font: 'inherit',
    padding: '6px 8px',
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
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className={styles.root}>
      <div className={styles.group}>
        <select
          className={styles.select}
          aria-label='Rows per page'
          value={`${table.getState().pagination.pageSize}`}
          onChange={(event) => {
            table.setPageSize(Number(event.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </option>
          ))}
        </select>
        <Text>Rows per page</Text>
      </div>

      <div className={styles.group}>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <div className={styles.group}>
          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to first page'
            icon={<ChevronDoubleLeft20Regular />}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />
          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to previous page'
            icon={<ChevronLeft20Regular />}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />

          {pageNumbers.map((pageNumber, index) => (
            <span key={`${pageNumber}-${index}`}>
              {pageNumber === '...' ? (
                <Text>...</Text>
              ) : (
                <Button
                  appearance={
                    currentPage === pageNumber ? 'primary' : 'outline'
                  }
                  size='small'
                  aria-label={`Go to page ${pageNumber}`}
                  onClick={() => table.setPageIndex((pageNumber as number) - 1)}
                >
                  {pageNumber}
                </Button>
              )}
            </span>
          ))}

          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to next page'
            icon={<ChevronRight20Regular />}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to last page'
            icon={<ChevronDoubleRight20Regular />}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
        </div>
      </div>
    </div>
  )
}
