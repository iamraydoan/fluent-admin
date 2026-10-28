import { type LinkProps } from '@tanstack/react-router'

type User = {
  name: string
  email: string
  avatar: string
  // Optional initials fallback for the header avatar, kept explicitly
  // on the user record instead of re-deriving it at each use.
  initials?: string
}

type Team = {
  name: string
  logo: React.ElementType
  plan: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavigationLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavigationCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

type NavigationItem = NavigationCollapsible | NavigationLink

type NavigationGroup = {
  title: string
  items: NavigationItem[]
}

type NavigationData = {
  user: User
  teams: Team[]
  navGroups: NavigationGroup[]
}

export type {
  NavigationData,
  NavigationGroup,
  NavigationItem,
  NavigationCollapsible,
  NavigationLink,
}
