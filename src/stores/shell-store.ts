import { create } from 'zustand'
import {
  MENU_GROUPS,
  type FluentMenuItem,
} from '@/features/mes-agent/menu-data'

// Shared shell state for the unified (MES-standard) shell: the
// multi-document tab strip and the FluentMenu expanded state. The
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

function flattenTitles(): { title: string; url: string }[] {
  const out: { title: string; url: string }[] = []
  const walk = (items: FluentMenuItem[]) => {
    for (const item of items) {
      if (item.url) out.push({ title: item.title, url: item.url })
      if (item.items) walk(item.items)
    }
  }
  for (const group of MENU_GROUPS) walk(group.items)
  return out
}

// Title for a route, by exact url match against the flattened
// MENU_GROUPS. Fallback: the last pathname segment, hyphen-split and
// capitalised per word (e.g. /settings/display -> Display).
export function titleForRoute(url: string): string {
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
  openTab: (tab) =>
    set((state) => ({
      tabs: state.tabs.some((t) => t.url === tab.url)
        ? state.tabs
        : [...state.tabs, tab],
      activeUrl: tab.url,
    })),
  closeTab: (url) => {
    const { tabs, activeUrl } = get()
    const index = tabs.findIndex((t) => t.url === url)
    if (index === -1) return activeUrl || '/'
    const remaining = tabs.filter((t) => t.url !== url)
    const next =
      remaining.length === 0
        ? '/'
        : index > 0
          ? remaining[index - 1].url
          : remaining[0].url
    set({
      tabs: remaining,
      activeUrl: url === activeUrl ? next : activeUrl,
    })
    return next
  },
  setActive: (url) =>
    set((state) =>
      state.tabs.some((t) => t.url === url) ? { activeUrl: url } : state
    ),
  registerRoute: (url) => {
    get().openTab({ id: url, title: titleForRoute(url), url })
  },
  toggleMenu: () => set((state) => ({ menuExpanded: !state.menuExpanded })),
}))
