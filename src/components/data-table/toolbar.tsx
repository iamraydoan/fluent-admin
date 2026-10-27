import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

const useStyles = makeStyles({
  root: {
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

  if (heading) {
    return (
      <div className={styles.listRoot}>
        <div className={styles.listRow}>
          <Text size={400} className={styles.heading}>
            {heading}
          </Text>
          <div className={styles.listRight}>
            {filterMenus}
            {searchInput}
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
