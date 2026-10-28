// Navigation visibility for the Display settings screen.
//
// Local-only persistence, same pattern as other local settings in
// this FE-only template: a single localStorage key, best-effort
// (storage unavailable => in-memory defaults for the session).
// No backend is involved. NavigationPane subscribes to changes via
// a window CustomEvent so toggling an item on the Display screen
// updates the nav immediately, without a reload and without
// touching the shell store (which owns tabs/menu-expanded only).
//
// Items are the eight top-level navigation entries, not the old
// unrelated sidebar list (Recents/Home/Applications/...). The
// 'settings' key controls the whole Settings parent, including its
// sub-items (Profile/Account/Appearance/Notifications/Display),
// because Settings is one document with sub-routes, not five
// top-level entries.
//
// Hide-all guard: the Display form schema already requires at least
// one visible item, so the last visible item cannot be unchecked.
// Even so, a hidden item is never unrecoverable: every route stays
// reachable by direct URL, so /settings/display always restores
// visibility even if Settings itself is hidden from the nav.

export const NAV_VISIBILITY_STORAGE_KEY = 'fluent-nav-visibility-v1'

export const NAV_VISIBILITY_CHANGED_EVENT = 'fluent-nav-visibility-changed'

export type NavVisibilityId =
  | 'dashboard'
  | 'users'
  | 'tasks'
  | 'apps'
  | 'settings'
  | 'rbac'
  | 'audit-log'
  | 'help-center'

export const NAV_DISPLAY_ITEMS: {
  id: NavVisibilityId
  label: string
}[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'apps', label: 'Apps' },
  { id: 'settings', label: 'Settings' },
  { id: 'rbac', label: 'RBAC' },
  { id: 'audit-log', label: 'Audit Log' },
  { id: 'help-center', label: 'Help Center' },
]

export type NavVisibility = Record<NavVisibilityId, boolean>

export const DEFAULT_NAV_VISIBILITY: NavVisibility = {
  dashboard: true,
  users: true,
  tasks: true,
  apps: true,
  settings: true,
  rbac: true,
  'audit-log': true,
  'help-center': true,
}

const VALID_IDS = new Set<string>(NAV_DISPLAY_ITEMS.map((item) => item.id))

function isNavVisibilityId(value: string): value is NavVisibilityId {
  return VALID_IDS.has(value)
}

// Title (as it appears in navigation-data) -> visibility id, for
// filtering nav groups in NavigationPane.
export function navVisibilityIdForTitle(title: string): NavVisibilityId | null {
  const found = NAV_DISPLAY_ITEMS.find((item) => item.label === title)
  return found ? found.id : null
}

export function loadNavVisibility(): NavVisibility {
  const fallback = { ...DEFAULT_NAV_VISIBILITY }
  try {
    if (typeof localStorage === 'undefined') return fallback
    const raw = localStorage.getItem(NAV_VISIBILITY_STORAGE_KEY)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return fallback
    const data = parsed as Record<string, unknown>
    const next = { ...fallback }
    for (const [key, value] of Object.entries(data)) {
      if (isNavVisibilityId(key) && typeof value === 'boolean') {
        next[key] = value
      }
    }
    return next
  } catch {
    return fallback
  }
}

export function saveNavVisibility(visibility: NavVisibility): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        NAV_VISIBILITY_STORAGE_KEY,
        JSON.stringify(visibility)
      )
    }
  } catch {
    // Storage full or unavailable: the nav still updates in
    // memory for this session via the change event below.
  }
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(NAV_VISIBILITY_CHANGED_EVENT))
    }
  } catch {
    // Event dispatch is best-effort; the nav re-reads storage on
    // every route change (remount) as a fallback.
  }
}

export function visibleNavItemIds(
  visibility: NavVisibility
): NavVisibilityId[] {
  return NAV_DISPLAY_ITEMS.filter((item) => visibility[item.id]).map(
    (item) => item.id
  )
}
