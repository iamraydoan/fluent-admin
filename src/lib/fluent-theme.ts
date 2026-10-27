import type { Theme } from '@fluentui/react-components'

/**
 * Fluent base font family for this app (Group 2 typography).
 *
 * Verified against installed @fluentui/react-components 9.74.11:
 * webLightTheme/webDarkTheme ship fontFamilyBase as
 * 'Segoe UI', 'Segoe UI Web (West European)', -apple-system,
 * BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif.
 * This stack only prepends 'Segoe UI Variable Text' (the current
 * Windows UI font, metric-compatible with Segoe UI) and inserts
 * system-ui before the -apple-system fallback, so the default
 * rendering stays Segoe-based instead of falling straight through
 * to the platform sans-serif (Noto Sans on Linux) when Segoe UI
 * is not installed. No other token is changed.
 *
 * Appearance picker (Settings > Appearance, src/config/fonts.ts,
 * src/context/font-provider.tsx) is intentionally NOT wired into
 * this theme: FontProvider only sets an html font-* class, while
 * FluentProvider sets its own font-family on its root element, so
 * the picker class already only affected elements outside the
 * provider (body chrome) before this change, and that behaviour
 * is unchanged. Wiring the picker into fontFamilyBase would make
 * the picker default ('inter') replace the Segoe base app-wide
 * and shift text widths, which is out of scope for a
 * no-layout-change group.
 */
export const FLUENT_FONT_FAMILY_BASE =
  "'Segoe UI Variable Text', 'Segoe UI', 'Segoe UI Web (West European)', " +
  "system-ui, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"

/** Copy of a Fluent web theme with only fontFamilyBase replaced. */
export function fluentTheme(base: Theme): Theme {
  return { ...base, fontFamilyBase: FLUENT_FONT_FAMILY_BASE }
}
