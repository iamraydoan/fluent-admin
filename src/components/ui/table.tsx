// Fluent Table wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Table styling system-wide.
import {
  Table as FluentTable,
  TableBody as FluentTableBody,
  TableCell as FluentTableCell,
  TableHeader as FluentTableHeader,
  TableHeaderCell as FluentTableHeaderCell,
  TableRow as FluentTableRow,
  type TableBodyProps,
  type TableCellProps,
  type TableHeaderCellProps,
  type TableHeaderProps,
  type TableProps,
  type TableRowProps,
} from '@fluentui/react-components'

export function Table(props: TableProps) {
  return <FluentTable {...props} />
}

export function TableBody(props: TableBodyProps) {
  return <FluentTableBody {...props} />
}

export function TableCell(props: TableCellProps) {
  return <FluentTableCell {...props} />
}

export function TableHeader(props: TableHeaderProps) {
  return <FluentTableHeader {...props} />
}

export function TableHeaderCell(props: TableHeaderCellProps) {
  return <FluentTableHeaderCell {...props} />
}

export function TableRow(props: TableRowProps) {
  return <FluentTableRow {...props} />
}
