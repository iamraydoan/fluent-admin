// Fluent Drawer wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Drawer styling system-wide.
import {
  Drawer as FluentDrawer,
  DrawerBody as FluentDrawerBody,
  DrawerFooter as FluentDrawerFooter,
  DrawerHeader as FluentDrawerHeader,
  type DrawerBodyProps,
  type DrawerFooterProps,
  type DrawerHeaderProps,
  type DrawerProps,
} from '@fluentui/react-components'

export function Drawer(props: DrawerProps) {
  return <FluentDrawer {...props} />
}

export function DrawerHeader(props: DrawerHeaderProps) {
  return <FluentDrawerHeader {...props} />
}

export function DrawerBody(props: DrawerBodyProps) {
  return <FluentDrawerBody {...props} />
}

export function DrawerFooter(props: DrawerFooterProps) {
  return <FluentDrawerFooter {...props} />
}
