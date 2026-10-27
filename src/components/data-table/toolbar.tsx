import { type Table } from '@tanstack/react-table'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Dismiss20Regular } from '@fluentui/react-icons'
import { Button } from '@/components/ui/button'
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
  input: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    font: 'inherit',
    padding: '6px 12px',
    width: '250px',
    maxWidth: '100%',
    boxSizing: 'border-box',
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
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const styles = useStyles()
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        {searchKey ? (
          <input
            className={styles.input}
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
          />
        ) : (
          <input
            className={styles.input}
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
        )}
        {filters.map((filter) => {
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
        })}
        {isFiltered && (
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
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
