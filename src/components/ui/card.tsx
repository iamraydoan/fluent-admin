// Fluent Card wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Card styling system-wide.
import {
  Card as FluentCard,
  CardHeader as FluentCardHeader,
  type CardHeaderProps,
  type CardProps,
} from '@fluentui/react-components'

export function Card(props: CardProps) {
  return <FluentCard {...props} />
}

export function CardHeader(props: CardHeaderProps) {
  return <FluentCardHeader {...props} />
}
