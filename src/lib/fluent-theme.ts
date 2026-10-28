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
 * The former appearance picker (Settings > Appearance, the deleted
 * src/config/fonts.ts and src/context/font-provider.tsx) used to offer
 * only 'system', which had no CSS rule: FontProvider only set an html
 * font-* class, while FluentProvider sets its own font-family on its
 * root element. Both files have since been deleted, so this Segoe
 * stack is now the single font source; no picker remains to wire in.
 */
export const FLUENT_FONT_FAMILY_BASE =
  "'Segoe UI Variable Text', 'Segoe UI', 'Segoe UI Web (West European)', " +
  "system-ui, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"

/** Copy of a Fluent web theme with only fontFamilyBase replaced. */
export function fluentTheme(base: Theme): Theme {
  return { ...base, fontFamilyBase: FLUENT_FONT_FAMILY_BASE }
}
