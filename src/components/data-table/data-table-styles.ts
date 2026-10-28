import { makeStyles, tokens } from '@fluentui/react-components'

/**
 * Shared data-table styles, used by both the Tasks and Users tables.
 * Tabular-nums intentionally does NOT live here: see
 * getNumericCellStyle in data-table-state.ts for why a Griffel class
 * cannot carry it through Fluent table cells.
 */
export const useDataTableSharedStyles = makeStyles({
  // Column resize handle: an 8px grab strip on the header cell's
  // right edge (positioned, so it never shifts the header content).
  resizeHandle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: tokens.spacingHorizontalS,
    height: '100%',
    cursor: 'col-resize',
    touchAction: 'none',
    userSelect: 'none',
    ':hover': {
      backgroundColor: tokens.colorNeutralStroke2,
    },
  },
  resizeHandleActive: {
    backgroundColor: tokens.colorBrandStroke1,
  },
})
