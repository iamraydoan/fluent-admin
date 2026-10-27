// Fluent Accordion wrappers, kept under their original names.
// Pass-through only: no style or behaviour change. Edit this file to
// change Accordion styling system-wide.
import {
  Accordion as FluentAccordion,
  AccordionHeader as FluentAccordionHeader,
  AccordionItem as FluentAccordionItem,
  AccordionPanel as FluentAccordionPanel,
  type AccordionHeaderProps,
  type AccordionItemProps,
  type AccordionPanelProps,
  type AccordionProps,
} from '@fluentui/react-components'

export function Accordion(props: AccordionProps) {
  return <FluentAccordion {...props} />
}

export function AccordionItem(props: AccordionItemProps) {
  return <FluentAccordionItem {...props} />
}

export function AccordionHeader(props: AccordionHeaderProps) {
  return <FluentAccordionHeader {...props} />
}

export function AccordionPanel(props: AccordionPanelProps) {
  return <FluentAccordionPanel {...props} />
}
