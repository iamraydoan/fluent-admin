import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { Tooltip } from '@/components/ui/tooltip'

const useStyles = makeStyles({
  // Entity Types pattern: fully right-aligned, with First/Prev/Next/
  // Last buttons and no direct page-number jumps. This footer sits
  // OUTSIDE the table scroll container and must never shrink or
  // scroll away, so it stays visible at the card bottom even with
  // 25 rows.
  root: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalL,
    flexWrap: 'wrap',
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalS,
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  pageNumbers: {
    fontVariantNumeric: 'tabular-nums',
  },
  // Double chevron for First/Last: the icon set has no double-chevron
  // glyph, so two single chevrons overlap by 8px.
  doubleChevron: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  doubleChevronOverlap: {
    marginLeft: '-12px',
  },
})

function DoubleChevronLeft() {
  const styles = useStyles()
  return (
    <span className={styles.doubleChevron} aria-hidden='true'>
      <ChevronLeft20Regular />
      <span className={styles.doubleChevronOverlap}>
        <ChevronLeft20Regular />
      </span>
    </span>
  )
}

function DoubleChevronRight() {
  const styles = useStyles()
  return (
    <span className={styles.doubleChevron} aria-hidden='true'>
      <ChevronRight20Regular />
      <span className={styles.doubleChevronOverlap}>
        <ChevronRight20Regular />
      </span>
    </span>
  )
}

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
          {/* 25 is the system default page size (see the tables'
          // defaultPageSize), so it must be a selectable option:
          // a native select cannot display a value that is not one
          // of its options, and without 25 here it fell back to
          // showing 10 while the table actually paged 25. The
          // original 10/20/30/40/50 options are all kept. */}
          {[10, 20, 25, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </option>
          ))}
        </Select>
      </div>

      <Text className={styles.pageNumbers}>
        Page {currentPage} of {totalPages} ({totalRecords} Records)
      </Text>

      <div className={styles.group}>
        <Tooltip content='Go to first page' relationship='label'>
          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to first page'
            icon={<DoubleChevronLeft />}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />
        </Tooltip>
        <Tooltip content='Go to previous page' relationship='label'>
          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to previous page'
            icon={<ChevronLeft20Regular />}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
        </Tooltip>
        <Tooltip content='Go to next page' relationship='label'>
          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to next page'
            icon={<ChevronRight20Regular />}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
        </Tooltip>
        <Tooltip content='Go to last page' relationship='label'>
          <Button
            appearance='outline'
            shape='square'
            size='small'
            aria-label='Go to last page'
            icon={<DoubleChevronRight />}
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          />
        </Tooltip>
      </div>
    </div>
  )
}
