// CSV export for list screens: downloads ALL filtered records (every
// page, not just the visible page or the current selection), with
// only the columns the caller passes in (already filtered to the
// visible, non-identifier columns). Cell values are plain text, so
// link cells resolve to their text and no markup is exported.
// UTF-8 with a BOM so spreadsheet apps open non-ASCII text correctly.

export type CsvColumn = {
  title: string
  values: string[]
}

function escapeCell(value: string): string {
  // Quote when the value contains a delimiter, a quote, or a line
  // break; double any embedded quotes (RFC 4180).
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function toCsvContent(columns: CsvColumn[]): string {
  const header = columns.map((column) => escapeCell(column.title)).join(',')
  const rowCount = columns.length > 0 ? columns[0].values.length : 0
  const lines = [header]
  for (let i = 0; i < rowCount; i++) {
    lines.push(
      columns.map((column) => escapeCell(column.values[i] ?? '')).join(',')
    )
  }
  return lines.join('\r\n')
}

export function downloadCsv(filename: string, columns: CsvColumn[]): number {
  const rowCount = columns.length > 0 ? columns[0].values.length : 0
  const blob = new Blob([`\uFEFF${toCsvContent(columns)}`], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
  return rowCount
}
