// Fluent Menu wrappers, kept under their original names.
// Pass-through only, except MenuPopover: its padding is deliberately
// 8px (tokens.spacingHorizontalS) instead of the stock 4px, so a
// hovered MenuItem stops 8px short of the Popover edge system-wide.
// MenuList is intentionally NOT padded as well: that would double
// the gap to 12px. Edit this file to change Menu styling system-wide.
import {
  tokens,
  Menu as FluentMenu,
  MenuDivider as FluentMenuDivider,
  MenuGroup as FluentMenuGroup,
  MenuGroupHeader as FluentMenuGroupHeader,
  MenuItem as FluentMenuItem,
  MenuList as FluentMenuList,
  MenuPopover as FluentMenuPopover,
  MenuTrigger as FluentMenuTrigger,
  type MenuDividerProps,
  type MenuGroupHeaderProps,
  type MenuGroupProps,
  type MenuItemProps,
  type MenuListProps,
  type MenuPopoverProps,
  type MenuProps,
  type MenuTriggerProps,
} from '@fluentui/react-components'

export function Menu(props: MenuProps) {
  return <FluentMenu {...props} />
}

export function MenuItem(props: MenuItemProps) {
  return <FluentMenuItem {...props} />
}

export function MenuList(props: MenuListProps) {
  return <FluentMenuList {...props} />
}

export function MenuPopover(props: MenuPopoverProps) {
  return (
    <FluentMenuPopover
      {...props}
      style={{ ...props.style, padding: tokens.spacingHorizontalS }}
    />
  )
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <FluentMenuTrigger {...props} />
}

export function MenuDivider(props: MenuDividerProps) {
  return <FluentMenuDivider {...props} />
}

export function MenuGroup(props: MenuGroupProps) {
  return <FluentMenuGroup {...props} />
}

export function MenuGroupHeader(props: MenuGroupHeaderProps) {
  return <FluentMenuGroupHeader {...props} />
}
