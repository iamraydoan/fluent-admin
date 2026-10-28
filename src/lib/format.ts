// Display-only number and phone formatters built on Intl. No new
// dependencies: libphonenumber-js is NOT installed, so phone formatting
// below is a simple US-format regex with a keep-original fallback, not
// libphonenumber parsing. These helpers change displayed text only;
// they never change the underlying data.

const numberFormatter = new Intl.NumberFormat('en-US')

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/**
 * Local date-time with seconds, e.g. 'Oct 26, 2026, 12:00:00 PM'.
 * Intl without a timeZone option formats in the viewer's local time,
 * so callers must label the result as local time where shown.
 */
export function formatDateTimeLocal(value: Date): string {
  return dateTimeFormatter.format(value)
}

/** Groups thousands, e.g. 2350 -> '2,350', 12234 -> '12,234'. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

/** USD currency with two fraction digits, e.g. 45231.89 -> '$45,231.89'. */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/**
 * Formats a change/delta value with an explicit sign: positive values get
 * '+', negative values get '-', zero gets no sign. The '+' here is ONLY
 * for deltas — never use this for absolute values (use formatNumber
 * instead, which carries no sign). Pass suffix '%' for percent deltas,
 * e.g. formatDelta(20.1, '%') -> '+20.1%'.
 */
export function formatDelta(value: number, suffix = ''): string {
  if (value === 0) return `0${suffix}`
  const sign = value > 0 ? '+' : '-'
  return `${sign}${numberFormatter.format(Math.abs(value))}${suffix}`
}

// Matches a US number with an optional +1 country code and optional
// separators, e.g. '+17593407614', '759-340-7614', '(759) 340-7614'.
const US_PHONE_PATTERN = /^\+?1?[-. ]?\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/

/**
 * Formats a US phone number as '+1 (759) 340-7614'. Anything that does
 * not match the US pattern (international numbers, extensions, malformed
 * input) is returned unchanged.
 */
export function formatPhone(value: string): string {
  const match = value.trim().match(US_PHONE_PATTERN)
  if (!match) return value
  return `+1 (${match[1]}) ${match[2]}-${match[3]}`
}
