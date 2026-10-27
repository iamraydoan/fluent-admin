// Fluent Skeleton wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Skeleton styling system-wide.
import {
  Skeleton as FluentSkeleton,
  SkeletonItem as FluentSkeletonItem,
  type SkeletonItemProps,
  type SkeletonProps,
} from '@fluentui/react-components'

export function Skeleton(props: SkeletonProps) {
  return <FluentSkeleton {...props} />
}

export function SkeletonItem(props: SkeletonItemProps) {
  return <FluentSkeletonItem {...props} />
}
