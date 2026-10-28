import { useCallback, useState, type CSSProperties } from 'react'
import type {
  Column,
  ColumnSizingState,
  OnChangeFn,
  VisibilityState,
} from '@tanstack/react-table'
import { tokens } from '@fluentui/react-components'

/**
 * Shared data-table state helpers, used by both the Tasks and Users
 * tables so density, visibility, pinning, sizing and numeric-cell
 * handling stay identical instead of drifting per screen.
 */

export type TableDensity = 'compact' | 'standard'

/**
 * Row/header heights per density. No Fluent size token equals 32px
 * or 40px, so these are named constants (the spec's exact values);
 * padding around them comes from spacing tokens, not hard-coded px.
 */
export const DENSITY_ROW_HEIGHTS: Record<TableDensity, string> = {
  compact: '32px',
  standard: '40px',
}

function readStoredValue(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private mode / blocked storage: the table still works in-memory.
  }
}

/**
 * Per-table density, persisted in localStorage under its own key.
 * Defaults to standard (40px): the roomier density, closest to the
 * Fluent default row height.
 */
export function useTableDensity(
  storageKey: string
): [TableDensity, (density: TableDensity) => void] {
  const [density, setDensityState] = useState<TableDensity>(() => {
    const stored = readStoredValue(storageKey)
    return stored === 'compact' || stored === 'standard' ? stored : 'standard'
  })
  const setDensity = useCallback(
    (next: TableDensity) => {
      setDensityState(next)
      writeStoredValue(storageKey, next)
    },
    [storageKey]
  )
  return [density, setDensity]
}

/**
 * Per-table column visibility, persisted in localStorage under its
 * own key and restored on load. Stored values are validated (plain
 * object of booleans only) so a corrupt entry falls back to all
 * columns visible instead of breaking the table.
 */
export function usePersistedColumnVisibility(
  storageKey: string
): [VisibilityState, OnChangeFn<VisibilityState>] {
  const [visibility, setVisibilityState] = useState<VisibilityState>(() => {
    const stored = readStoredValue(storageKey)
    if (!stored) return {}
    try {
      const parsed: unknown = JSON.parse(stored)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const clean: VisibilityState = {}
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === 'boolean') clean[key] = value
        }
        return clean
      }
    } catch {
      // Corrupt entry: fall through to the default below.
    }
    return {}
  })
  const onVisibilityChange: OnChangeFn<VisibilityState> = useCallback(
    (updater) => {
      setVisibilityState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        writeStoredValue(storageKey, JSON.stringify(next))
        return next
      })
    },
    [storageKey]
  )
  return [visibility, onVisibilityChange]
}

/**
 * Sticky-left style for a pinned column. Header cells sit above body
 * cells (z 4 vs z 1) and above the unpinned header cells (z 3, set in
 * each table's headerCell style) so a pinned body cell scrolling
 * vertically never paints over the header, while still covering
 * unpinned body cells during horizontal scroll. Backgrounds are
 * theme tokens: the header band token for headers, the default cell
 * background for body cells, so scrolled content never shows through.
 * The right border is the table's divider token: it marks the frozen
 * edge so pinned columns stay visually distinct from scrolled ones.
 */
export function getPinnedCellStyle<TData, TValue>(
  column: Column<TData, TValue>,
  header: boolean
): CSSProperties | undefined {
  if (column.getIsPinned() !== 'left') return undefined
  return {
    position: 'sticky',
    left: column.getStart('left'),
    zIndex: header ? 4 : 1,
    backgroundColor: header
      ? tokens.colorNeutralBackground3
      : tokens.colorNeutralBackground1,
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  }
}

/**
 * Width style for a column whose width is known exactly: pinned
 * columns (their widths feed the sticky left offsets, so they must
 * be exact) and columns the user has resized. All other columns keep
 * automatic layout, so unresized tables render exactly as before.
 */
export function getSizedColumnWidth<TData, TValue>(
  column: Column<TData, TValue>,
  columnSizing: ColumnSizingState
): CSSProperties | undefined {
  if (
    column.getIsPinned() === 'left' ||
    columnSizing[column.id] !== undefined
  ) {
    return { width: column.getSize() }
  }
  return undefined
}

/**
 * Columns whose cells are digit-bearing, so they get tabular-nums
 * through the shared table-cell path (see getNumericCellStyle).
 * 'id' is the Tasks TASK column (TASK-####); 'phoneNumber' is the
 * Users formatted phone column. No other rendered column id matches.
 */
export const NUMERIC_COLUMN_IDS: ReadonlySet<string> = new Set([
  'id',
  'phoneNumber',
])

export function isNumericColumn(columnId: string): boolean {
  return NUMERIC_COLUMN_IDS.has(columnId)
}

/**
 * Tabular-nums for numeric cells, as an inline style — deliberately
 * NOT a Griffel class. Verified in the browser: a Griffel class
 * carrying font-variant-numeric (and the dividerCell borderRight
 * class) does not survive Fluent TableCell/TableHeaderCell's
 * mergeClasses — the rule exists in the stylesheet but zero table
 * cells carry the class — while the same declaration works on plain
 * elements and on Fluent Text. Inline styles pass through the
 * Fluent cell slots untouched (like the pinned/width styles above),
 * so the shared style helper is the reliable path here.
 */
export function getNumericCellStyle(
  columnId: string
): CSSProperties | undefined {
  if (!isNumericColumn(columnId)) return undefined
  return { fontVariantNumeric: 'tabular-nums' }
}
