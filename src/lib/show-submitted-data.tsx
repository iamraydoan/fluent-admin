import { toast } from './toast'

export function showSubmittedData(
  data: unknown,
  title: string = 'You submitted the following values:'
) {
  // Fluent Toast only carries a title string (no rich JSX body), so
  // the submitted values are appended as JSON text.
  // Callers and tests only depend on this function being called with
  // (data) or (data, title), not on the toast rendering.
  toast.info(`${title} ${JSON.stringify(data)}`)
}
