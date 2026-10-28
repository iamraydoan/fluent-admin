import { create } from 'zustand'
// Title lookup uses the standard navigation-data (single source,
// shared with NavigationPane and command-menu). The old
// mes-agent/menu-data.ts MENU_GROUPS copy was deleted; titles and
// urls come from navigation-data.navGroups directly, teams are not
// involved here.
import { navigationData } from '@/components/layout/data/navigation-data'

// Shared shell state for the unified (MES-standard) shell: the
// multi-tab strip and the NavigationPane expanded state. The
// menu must NOT reset when moving between /mes-agent (its own
// top-level route) and the _authenticated screens, so this state
// lives outside both shells, in one store both read.
//
// In-memory only: no cookie / localStorage persistence, on purpose
// (the old sidebar's cookie state is gone with NavigationPane).

export type ShellTab = {
  id: string
  title: string
  url: string
  // Entity icon, matched from navigation-data (same ElementType
  // nav items use: Fluent bundle icons, Regular at rest, Filled
  // when active). Not serialised: persistence stores title/url/
  // pinned only and re-hydrates the icon from navigation-data on
  // load, because components cannot be JSON-serialised.
  icon?: React.ElementType
  // Pinned tabs sort first in the strip and are excluded from
  // Close Others and Close All. The tabs array itself stays in
  // insertion order; the pinned-first order is derived by
  // sortedTabs, so unpinning restores the original position.
  pinned?: boolean
}

// Settings is one document, not five: its object tabs (Profile /
// Account / Appearance / Notifications / Display) are sub-routes
// under /settings, but they must NOT each open a document tab.
// Every registration path (layout registerRoute on route change,
// NavigationPane openTab on menu click) funnels through this store, so
// the canonicalisation lives here: any /settings* route collapses
// to the single '/settings' document tab titled 'Settings'.
// (The layout and menu files themselves are owned by other workers,
// so they are deliberately NOT touched.) MES object tabs are local
// state, not routes, so they never reach this code and are unaffected.
export const SETTINGS_TAB_URL = '/settings'

function isSettingsRoute(url: string): boolean {
  return url === SETTINGS_TAB_URL || url.startsWith(`${SETTINGS_TAB_URL}/`)
}

function canonicalTab(tab: ShellTab): ShellTab {
  if (!isSettingsRoute(tab.url)) return tab
  return { id: SETTINGS_TAB_URL, title: 'Settings', url: SETTINGS_TAB_URL }
}

// Two levels only, matching the real data shape: navGroups ->
// items -> sub-items (sub-items are leaves, no grandchildren in
// navigation-data). This replaces the old recursive walk over
// MENU_GROUPS with the same result, without a recursive type.
function flattenEntries(): {
  title: string
  url: string
  icon?: React.ElementType
}[] {
  const out: { title: string; url: string; icon?: React.ElementType }[] = []
  for (const group of navigationData.navGroups) {
    for (const item of group.items) {
      if (item.url)
        out.push({ title: item.title, url: item.url, icon: item.icon })
      if (item.items) {
        for (const sub of item.items) {
          if (sub.url)
            out.push({ title: sub.title, url: sub.url, icon: sub.icon })
        }
      }
    }
  }
  return out
}

function flattenTitles(): { title: string; url: string }[] {
  return flattenEntries().map(({ title, url }) => ({ title, url }))
}

// Entity icon for a route, by exact url match against
// navigation-data. Settings is special-cased BEFORE the flatten
// lookup, for the same reason as titleForRoute: the document tab
// is titled 'Settings', so it takes the Settings parent icon, not
// the 'Profile' sub-item icon that the '/settings' url would
// otherwise match. Routes with no navigation entry (e.g. the Clerk
// User Management sub-item, which has no icon) get undefined and
// render with no entity icon.
export function iconForRoute(url: string): React.ElementType | undefined {
  if (isSettingsRoute(url)) {
    for (const group of navigationData.navGroups) {
      for (const item of group.items) {
        if (item.title === 'Settings') return item.icon
      }
    }
    return undefined
  }
  return flattenEntries().find((entry) => entry.url === url)?.icon
}

// Display order for the tab strip: pinned tabs first, each block
// in insertion order. Pure and stable, so unpinning a tab returns
// it to exactly its original position among unpinned tabs.
export function sortedTabs(tabs: ShellTab[]): ShellTab[] {
  return [
    ...tabs.filter((tab) => tab.pinned),
    ...tabs.filter((tab) => !tab.pinned),
  ]
}

// Persistence: a single localStorage key holding title/url/pinned
// per tab plus the active url and menu state. Icons are re-hydrated
// via iconForRoute on load; dirty flags are never persisted (form
// state is gone after a reload). Validation is strict on purpose:
// any structurally invalid entry discards the whole payload and
// falls back to empty tabs, rather than restoring a half-corrupt
// strip. Urls must exist in navigation-data, so a tab for a removed
// route never comes back from storage.
export const SHELL_TABS_STORAGE_KEY = 'fluent-shell-tabs-v1'

type PersistedShell = {
  tabs: ShellTab[]
  activeUrl: string
  menuExpanded: boolean
}

function loadPersistedShell(): PersistedShell {
  const empty: PersistedShell = { tabs: [], activeUrl: '', menuExpanded: true }
  try {
    if (typeof localStorage === 'undefined') return empty
    const raw = localStorage.getItem(SHELL_TABS_STORAGE_KEY)
    if (!raw) return empty
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return empty
    const data = parsed as {
      tabs?: unknown
      activeUrl?: unknown
      menuExpanded?: unknown
    }
    if (!Array.isArray(data.tabs)) return empty
    const validUrls = new Set(flattenEntries().map((entry) => entry.url))
    const tabs: ShellTab[] = []
    const seen = new Set<string>()
    for (const entry of data.tabs) {
      if (typeof entry !== 'object' || entry === null) return empty
      const tab = entry as { title?: unknown; url?: unknown; pinned?: unknown }
      if (typeof tab.title !== 'string' || typeof tab.url !== 'string')
        return empty
      if (tab.pinned !== undefined && typeof tab.pinned !== 'boolean')
        return empty
      const canonical = canonicalTab({
        id: tab.url,
        title: tab.title,
        url: tab.url,
      })
      if (!validUrls.has(canonical.url)) return empty
      if (seen.has(canonical.url)) return empty
      seen.add(canonical.url)
      tabs.push({
        id: canonical.url,
        title: canonical.title,
        url: canonical.url,
        icon: iconForRoute(canonical.url),
        pinned: tab.pinned === true,
      })
    }
    const activeUrl =
      typeof data.activeUrl === 'string' && seen.has(data.activeUrl)
        ? data.activeUrl
        : (tabs[0]?.url ?? '')
    return {
      tabs,
      activeUrl,
      menuExpanded:
        typeof data.menuExpanded === 'boolean' ? data.menuExpanded : true,
    }
  } catch {
    return empty
  }
}

// Title for a route, by exact url match against the flattened
// navigation-data.navGroups. Settings is special-cased BEFORE the
// flatten lookup: the menu lists '/settings' as the 'Profile'
// child, so the flatten match would title the document tab
// 'Profile'; every /settings* route is the single 'Settings'
// document instead.
// Fallback: the last pathname segment, hyphen-split and
// capitalised per word (e.g. /settings/display -> Display).
export function titleForRoute(url: string): string {
  if (isSettingsRoute(url)) return 'Settings'
  const match = flattenTitles().find((entry) => entry.url === url)
  if (match) return match.title
  const segments = url.split('/').filter(Boolean)
  const segment = segments.length > 0 ? segments[segments.length - 1] : ''
  if (!segment) return 'Dashboard'
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

type ShellState = {
  tabs: ShellTab[]
  activeUrl: string
  menuExpanded: boolean
  // Unsaved-changes flags, per tab url. In-memory only, never
  // persisted: the form behind a dirty flag is gone after reload.
  // Closing a tab always clears its flag.
  dirty: Record<string, boolean>
  // Open a tab, or just activate it if its url is already open
  // (never duplicates). Always makes the tab active.
  openTab: (tab: ShellTab) => void
  // Close a tab. Returns the url the shell should navigate to: the
  // preceding tab in the remaining list, the first remaining tab if
  // the closed one was first, or '/' when no tab remains. The caller
  // only navigates when the closed tab was the active one; closing
  // an inactive tab leaves the current screen in place.
  // "Preceding" is in pinned-first display order (sortedTabs),
  // matching what the user sees in the strip.
  closeTab: (url: string) => string
  setActive: (url: string) => void
  // Register the current route as a tab (direct URL navigation).
  // Idempotent by url: re-registering an open tab only activates it.
  registerRoute: (url: string) => void
  toggleMenu: () => void
  // Pin state: pinned tabs sort first (sortedTabs) and are
  // excluded from closeOthers and closeAll. Pin/unpin never
  // reorder the stored array, so unpinning restores position.
  pinTab: (url: string) => void
  unpinTab: (url: string) => void
  // Close every tab except the given one and all pinned tabs.
  // Returns the url to navigate to: the kept tab when the active
  // tab was closed, otherwise the unchanged active url.
  closeOthers: (url: string) => string
  // Close every unpinned tab. Returns the url to navigate to:
  // the first remaining pinned tab, the unchanged active url when
  // it was pinned, or '/' when nothing remains.
  closeAll: () => string
  markDirty: (url: string) => void
  clearDirty: (url: string) => void
  isDirty: (url: string) => boolean
}

const restoredShell = loadPersistedShell()

// Remove a tab's dirty flag without touching other flags.
function pruneDirty(
  dirty: Record<string, boolean>,
  urls: string[]
): Record<string, boolean> {
  if (urls.length === 0) return dirty
  const next = { ...dirty }
  for (const url of urls) delete next[url]
  return next
}

export const useShellStore = create<ShellState>()((set, get) => ({
  tabs: restoredShell.tabs,
  activeUrl: restoredShell.activeUrl,
  menuExpanded: restoredShell.menuExpanded,
  dirty: {},
  openTab: (tab) => {
    const canonical = canonicalTab(tab)
    set((state) => {
      const existing = state.tabs.find((t) => t.url === canonical.url)
      if (existing) {
        // Re-opening keeps the stored tab (its pinned flag and
        // icon) and only activates it; the incoming title is
        // ignored so a stale caller cannot rename an open tab.
        return { tabs: state.tabs, activeUrl: canonical.url }
      }
      return {
        tabs: [
          ...state.tabs,
          {
            ...canonical,
            icon: canonical.icon ?? tab.icon ?? iconForRoute(canonical.url),
            pinned: tab.pinned === true,
          },
        ],
        activeUrl: canonical.url,
      }
    })
  },
  closeTab: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    const { tabs, activeUrl, dirty } = get()
    const ordered = sortedTabs(tabs)
    const index = ordered.findIndex((t) => t.url === canonicalUrl)
    if (index === -1) return activeUrl || '/'
    const remaining = tabs.filter((t) => t.url !== canonicalUrl)
    const orderedRemaining = sortedTabs(remaining)
    const next =
      orderedRemaining.length === 0
        ? '/'
        : index > 0
          ? orderedRemaining[index - 1].url
          : orderedRemaining[0].url
    set({
      tabs: remaining,
      activeUrl: canonicalUrl === activeUrl ? next : activeUrl,
      dirty: pruneDirty(dirty, [canonicalUrl]),
    })
    return next
  },
  setActive: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    set((state) =>
      state.tabs.some((t) => t.url === canonicalUrl)
        ? { activeUrl: canonicalUrl }
        : state
    )
  },
  // Register the current route as a tab (direct URL navigation).
  // Idempotent by url: re-registering an open tab only activates it.
  // Settings sub-routes collapse to the single Settings tab.
  registerRoute: (url) => {
    const canonical = canonicalTab({ id: url, title: '', url })
    get().openTab({
      id: canonical.url,
      title: titleForRoute(url),
      url: canonical.url,
    })
  },
  toggleMenu: () => set((state) => ({ menuExpanded: !state.menuExpanded })),
  pinTab: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.url === canonicalUrl ? { ...tab, pinned: true } : tab
      ),
    }))
  },
  unpinTab: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.url === canonicalUrl ? { ...tab, pinned: false } : tab
      ),
    }))
  },
  closeOthers: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    const { tabs, activeUrl, dirty } = get()
    if (!tabs.some((t) => t.url === canonicalUrl)) return activeUrl || '/'
    const remaining = tabs.filter((t) => t.pinned || t.url === canonicalUrl)
    const closed = tabs
      .filter((t) => !remaining.some((kept) => kept.url === t.url))
      .map((t) => t.url)
    const next = remaining.some((t) => t.url === activeUrl)
      ? activeUrl
      : canonicalUrl
    set({ tabs: remaining, activeUrl: next, dirty: pruneDirty(dirty, closed) })
    return next
  },
  closeAll: () => {
    const { tabs, activeUrl, dirty } = get()
    const remaining = tabs.filter((t) => t.pinned)
    const closed = tabs.filter((t) => !t.pinned).map((t) => t.url)
    const next = remaining.some((t) => t.url === activeUrl)
      ? activeUrl
      : (remaining[0]?.url ?? '/')
    set({ tabs: remaining, activeUrl: next, dirty: pruneDirty(dirty, closed) })
    return next
  },
  markDirty: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    if (!canonicalUrl) return
    set((state) => ({ dirty: { ...state.dirty, [canonicalUrl]: true } }))
  },
  clearDirty: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    if (!canonicalUrl) return
    set((state) => ({ dirty: pruneDirty(state.dirty, [canonicalUrl]) }))
  },
  isDirty: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    return get().dirty[canonicalUrl] === true
  },
}))

// Persist tabs + active tab + menu state on every relevant change.
// Dirty flags are deliberately excluded (see the type comment).
// Writes are skipped when the serialised payload is unchanged, so
// unrelated store updates (e.g. a dirty flag flip) do not churn
// localStorage.
let lastPersistedJson = ''
useShellStore.subscribe((state) => {
  const payload = JSON.stringify({
    version: 1,
    tabs: state.tabs.map((tab) => ({
      title: tab.title,
      url: tab.url,
      pinned: tab.pinned === true,
    })),
    activeUrl: state.activeUrl,
    menuExpanded: state.menuExpanded,
  })
  if (payload === lastPersistedJson) return
  lastPersistedJson = payload
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SHELL_TABS_STORAGE_KEY, payload)
    }
  } catch {
    // Storage full or unavailable (private mode): tabs still work
    // in memory for this session; persistence is best-effort.
  }
})
