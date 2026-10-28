import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import type { TableDensity } from './data-table-state'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableFieldFilter } from './field-filter'
import { DataTableSingleSelectFilter } from './single-select-filter'
import { DataTableViewOptions } from './view-options'

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    flex: '1',
  },
  // Entity Types list pattern: two header rows inside the main card.
  listRoot: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  listRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  listRight: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  heading: {
    fontWeight: tokens.fontWeightSemibold,
  },
})

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  /**
   * List-header (heading) filters, in the reference-image style.
   * Single-select dropdowns (label "STATUS:" outside the box, value
   * "ALL"/"Done" inside) replace the old faceted multi-select menus
   * on list screens; the old `filters` prop is kept only for the
   * legacy non-heading layout below. Field filters are label + input
   * + funnel-button filters for one specific text column
   * (Integration Handler "NAME:" style).
   *
   * Search box IS present in the list heading, by user decision
   * 2026-10-27 ~14:34, reversing the 2026-10-27 ~14:05 removal:
   * the list filter row holds single-select dropdowns, field
   * filters, the Search box, then Reset, in that order. The header
   * Search icon button in the tab strip is separate and
   * unchanged: it opens the command menu (command/page search),
   * not table-row search.
   *
   * Deliberately absent here, by data type, not by omission:
   * - checkbox filters (SAP "TERMINATED", Queries "SYSTEM ITEMS")
   *   only exist for a boolean field, and neither Tasks nor Users
   *   has one, so no checkbox control is rendered;
   * - an "Advanced" button only exists for a screen complex enough
   *   to need a real multi-field panel, and Tasks/Users filters all
   *   fit in this header row, so no dead Advanced button is added.
   */
  singleSelectFilters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
    }[]
  }[]
  fieldFilters?: {
    columnId: string
    label: string
  }[]
  /**
   * Entity Types list heading, e.g. "Tasks (42)". When provided, the
   * toolbar renders the two-row list header (row 1: heading left,
   * filters + search right; row 2: view options right) instead of the
   * legacy single-row layout.
   */
  heading?: string
  /** Row density, shown as a Compact/Standard toggle in View menu. */
  density?: TableDensity
  onDensityChange?: (density: TableDensity) => void
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  singleSelectFilters = [],
  fieldFilters = [],
  heading,
  density,
  onDensityChange,
}: DataTableToolbarProps<TData>) {
  const styles = useStyles()
  /**
   * Reset = filters + sort + selection + page 1. Column
   * visibility and density are view preferences and are
   * deliberately kept: Reset restores the data view, not the
   * user's chosen layout. Selection count (where lifted, e.g.
   * Tasks) is the TOTAL selected across all pages and filters,
   * not the filtered-page count, and selection is not cleared
   * by filtering — only by this Reset (or by unchecking).
   */
  const isResettable =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter) ||
    table.getState().sorting.length > 0 ||
    Object.keys(table.getState().rowSelection).length > 0 ||
    table.getState().pagination.pageIndex > 0

  const handleReset = () => {
    table.resetColumnFilters()
    if (table.getState().globalFilter) table.setGlobalFilter('')
    table.resetSorting()
    table.resetRowSelection()
    table.setPageIndex(0)
  }

  const searchInput = searchKey ? (
    <Input
      style={{ width: '250px', maxWidth: '100%' }}
      placeholder={searchPlaceholder}
      value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
      onChange={(_, data) =>
        table.getColumn(searchKey)?.setFilterValue(data.value)
      }
    />
  ) : (
    <Input
      style={{ width: '250px', maxWidth: '100%' }}
      placeholder={searchPlaceholder}
      value={table.getState().globalFilter ?? ''}
      onChange={(_, data) => table.setGlobalFilter(data.value)}
    />
  )

  const filterMenus = filters.map((filter) => {
    const column = table.getColumn(filter.columnId)
    if (!column) return null
    return (
      <DataTableFacetedFilter
        key={filter.columnId}
        column={column}
        title={filter.title}
        options={filter.options}
      />
    )
  })

  const resetButton = isResettable ? (
    <Button
      appearance='subtle'
      size='small'
      icon={<Dismiss20Regular />}
      onClick={handleReset}
    >
      Reset
    </Button>
  ) : null

  const singleSelectMenus = singleSelectFilters.map((filter) => (
    <DataTableSingleSelectFilter
      key={filter.columnId}
      column={table.getColumn(filter.columnId)}
      title={filter.title}
      options={filter.options}
    />
  ))

  const fieldFilterControls = fieldFilters.map((filter) => (
    <DataTableFieldFilter
      key={filter.columnId}
      column={table.getColumn(filter.columnId)}
      label={filter.label}
    />
  ))

  if (heading) {
    return (
      <div className={styles.listRoot}>
        <div className={styles.listRow}>
          <Text size={400} className={styles.heading}>
            {heading}
          </Text>
          <div className={styles.listRight}>
            {singleSelectMenus}
            {fieldFilterControls}
            {searchInput}
            {resetButton}
          </div>
        </div>
        <div className={styles.listRow}>
          <span />
          <DataTableViewOptions
            table={table}
            density={density}
            onDensityChange={onDensityChange}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        {searchInput}
        {filterMenus}
        {resetButton}
      </div>
      <DataTableViewOptions
        table={table}
        density={density}
        onDensityChange={onDensityChange}
      />
    </div>
  )
}
