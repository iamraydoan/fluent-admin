import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
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
    gap: '8px',
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    flex: '1',
  },
  // Entity Types list pattern: two header rows inside the main card.
  listRoot: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    flexWrap: 'wrap',
  },
  listRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
   * Deliberately absent from the list heading, by user correction:
   * there is NO global Search box here — the original list screens
   * do not have one in this filter row, and the header already has
   * a Search icon button in the document tab strip. The `searchInput`
   * below is only used by the legacy non-heading layout.
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
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  singleSelectFilters = [],
  fieldFilters = [],
  heading,
}: DataTableToolbarProps<TData>) {
  const styles = useStyles()
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

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

  const resetButton = isFiltered ? (
    <Button
      appearance='subtle'
      size='small'
      icon={<Dismiss20Regular />}
      onClick={() => {
        table.resetColumnFilters()
        table.setGlobalFilter('')
      }}
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
            {resetButton}
          </div>
        </div>
        <div className={styles.listRow}>
          <span />
          <DataTableViewOptions table={table} />
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
      <DataTableViewOptions table={table} />
    </div>
  )
}
