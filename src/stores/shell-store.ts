import { create } from 'zustand'
// Title lookup uses the standard sidebar-data (single source,
// shared with AppSidebar and command-menu). The old
// mes-agent/menu-data.ts MENU_GROUPS copy was deleted; titles and
// urls come from sidebar-data.navGroups directly, teams are not
// involved here.
import { sidebarData } from '@/components/layout/data/sidebar-data'

// Shared shell state for the unified (MES-standard) shell: the
// multi-document tab strip and the AppSidebar expanded state. The
// menu must NOT reset when moving between /mes-agent (its own
// top-level route) and the _authenticated screens, so this state
// lives outside both shells, in one store both read.
//
// In-memory only: no cookie / localStorage persistence, on purpose
// (the old sidebar's cookie state is gone with AppSidebar).

export type ShellTab = {
  id: string
  title: string
  url: string
}

// Settings is one document, not five: its object tabs (Profile /
// Account / Appearance / Notifications / Display) are sub-routes
// under /settings, but they must NOT each open a document tab.
// Every registration path (layout registerRoute on route change,
// AppSidebar openTab on menu click) funnels through this store, so
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
// sidebar-data). This replaces the old recursive walk over
// MENU_GROUPS with the same result, without a recursive type.
function flattenTitles(): { title: string; url: string }[] {
  const out: { title: string; url: string }[] = []
  for (const group of sidebarData.navGroups) {
    for (const item of group.items) {
      if (item.url) out.push({ title: item.title, url: item.url })
      if (item.items) {
        for (const sub of item.items) {
          if (sub.url) out.push({ title: sub.title, url: sub.url })
        }
      }
    }
  }
  return out
}

// Title for a route, by exact url match against the flattened
// sidebar-data.navGroups. Settings is special-cased BEFORE the
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
  // Open a tab, or just activate it if its url is already open
  // (never duplicates). Always makes the tab active.
  openTab: (tab: ShellTab) => void
  // Close a tab. Returns the url the shell should navigate to: the
  // preceding tab in the remaining list, the first remaining tab if
  // the closed one was first, or '/' when no tab remains. The caller
  // only navigates when the closed tab was the active one; closing
  // an inactive tab leaves the current screen in place.
  closeTab: (url: string) => string
  setActive: (url: string) => void
  // Register the current route as a tab (direct URL navigation).
  // Idempotent by url: re-registering an open tab only activates it.
  registerRoute: (url: string) => void
  toggleMenu: () => void
}

export const useShellStore = create<ShellState>()((set, get) => ({
  tabs: [],
  activeUrl: '',
  menuExpanded: true,
  openTab: (tab) => {
    const canonical = canonicalTab(tab)
    set((state) => ({
      tabs: state.tabs.some((t) => t.url === canonical.url)
        ? state.tabs
        : [...state.tabs, canonical],
      activeUrl: canonical.url,
    }))
  },
  closeTab: (url) => {
    const canonicalUrl = canonicalTab({ id: url, title: '', url }).url
    const { tabs, activeUrl } = get()
    const index = tabs.findIndex((t) => t.url === canonicalUrl)
    if (index === -1) return activeUrl || '/'
    const remaining = tabs.filter((t) => t.url !== canonicalUrl)
    const next =
      remaining.length === 0
        ? '/'
        : index > 0
          ? remaining[index - 1].url
          : remaining[0].url
    set({
      tabs: remaining,
      activeUrl: canonicalUrl === activeUrl ? next : activeUrl,
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
}))
