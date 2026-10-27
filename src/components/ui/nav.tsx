// Fluent Nav wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Nav styling system-wide.
import {
  Nav as FluentNav,
  NavItem as FluentNavItem,
  NavSectionHeader as FluentNavSectionHeader,
  type NavItemProps,
  type NavProps,
  type NavSectionHeaderProps,
} from '@fluentui/react-components'

export function Nav(props: NavProps) {
  return <FluentNav {...props} />
}

export function NavItem(props: NavItemProps) {
  return <FluentNavItem {...props} />
}

export function NavSectionHeader(props: NavSectionHeaderProps) {
  return <FluentNavSectionHeader {...props} />
}
