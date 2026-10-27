// Fluent Menu wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Menu styling system-wide.
import {
  Menu as FluentMenu,
  MenuItem as FluentMenuItem,
  MenuList as FluentMenuList,
  MenuPopover as FluentMenuPopover,
  MenuTrigger as FluentMenuTrigger,
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
  return <FluentMenuPopover {...props} />
}

export function MenuTrigger(props: MenuTriggerProps) {
  return <FluentMenuTrigger {...props} />
}
