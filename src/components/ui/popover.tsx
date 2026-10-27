// Fluent Popover wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Popover styling system-wide.
import {
  Popover as FluentPopover,
  PopoverSurface as FluentPopoverSurface,
  PopoverTrigger as FluentPopoverTrigger,
  type PopoverProps,
  type PopoverSurfaceProps,
  type PopoverTriggerProps,
} from '@fluentui/react-components'

export function Popover(props: PopoverProps) {
  return <FluentPopover {...props} />
}

export function PopoverTrigger(props: PopoverTriggerProps) {
  return <FluentPopoverTrigger {...props} />
}

export function PopoverSurface(props: PopoverSurfaceProps) {
  return <FluentPopoverSurface {...props} />
}
